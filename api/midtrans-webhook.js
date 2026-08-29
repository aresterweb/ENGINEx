const {
    createClient
} = require(
    "@supabase/supabase-js"
);

const crypto =
    require("crypto");


/* =========================================================
   SUPABASE ADMIN
========================================================= */

const supabaseAdmin =
    createClient(

        process.env.SUPABASE_URL,

        process.env
            .SUPABASE_SERVICE_ROLE_KEY,

        {

            auth: {

                autoRefreshToken:
                    false,

                persistSession:
                    false

            }

        }

    );


/* =========================================================
   HANDLER
========================================================= */

module.exports =
async function handler(
    req,
    res
) {


    /* =====================================================
       ONLY POST
    ===================================================== */

    if (
        req.method !== "POST"
    ) {

        return res
            .status(405)
            .json({

                message:
                    "Method not allowed."

            });

    }


    try {


        /* =================================================
           CHECK SERVER KEY
        ================================================= */

        if (
            !process.env
                .MIDTRANS_SERVER_KEY
        ) {

            console.error(
                "MIDTRANS_SERVER_KEY missing."
            );


            return res
                .status(500)
                .json({

                    message:
                        "Server configuration error."

                });

        }



        /* =================================================
           READ BODY
        ================================================= */

        const body =
            typeof req.body ===
            "string"

                ? JSON.parse(
                    req.body
                )

                : req.body || {};



        const orderId =
            body.order_id;


        const statusCode =
            body.status_code;


        const grossAmount =
            body.gross_amount;


        const transactionStatus =
            body.transaction_status;


        const fraudStatus =
            body.fraud_status;


        const signatureKey =
            body.signature_key;



        /* =================================================
           VALIDATE BASIC DATA
        ================================================= */

        if (
            !orderId ||
            !statusCode ||
            !grossAmount ||
            !transactionStatus ||
            !signatureKey
        ) {

            return res
                .status(400)
                .json({

                    message:
                        "Incomplete notification."

                });

        }



        /* =================================================
           VERIFY MIDTRANS SIGNATURE
        ================================================= */

        const rawSignature =

            orderId +

            statusCode +

            grossAmount +

            process.env
                .MIDTRANS_SERVER_KEY;


        const expectedSignature =

            crypto

                .createHash(
                    "sha512"
                )

                .update(
                    rawSignature
                )

                .digest(
                    "hex"
                );


        const validSignature =

            expectedSignature.length ===
            signatureKey.length &&

            crypto.timingSafeEqual(

                Buffer.from(
                    expectedSignature
                ),

                Buffer.from(
                    signatureKey
                )

            );


        if (!validSignature) {

            console.error(
                "Invalid Midtrans signature:",
                orderId
            );


            return res
                .status(401)
                .json({

                    message:
                        "Invalid signature."

                });

        }



        /* =================================================
           FIND PAYMENT
        ================================================= */

        const {
            data: payment,
            error: paymentError
        } =

            await supabaseAdmin

                .from(
                    "payments"
                )

                .select(
                    "*"
                )

                .eq(
                    "order_id",
                    orderId
                )

                .maybeSingle();


        if (
            paymentError ||
            !payment
        ) {

            console.error(
                "Payment not found:",
                orderId,
                paymentError
            );


            return res
                .status(404)
                .json({

                    message:
                        "Payment not found."

                });

        }



        /* =================================================
           VERIFY AMOUNT
        ================================================= */

        const paidAmount =
            Math.round(
                Number(
                    grossAmount
                )
            );


        if (
            paidAmount !==
            Number(
                payment.amount
            )
        ) {

            console.error(
                "Payment amount mismatch:",
                orderId
            );


            return res
                .status(400)
                .json({

                    message:
                        "Payment amount mismatch."

                });

        }



        /* =================================================
           DETERMINE STATUS
        ================================================= */

        let paymentStatus =
            "pending";


        let activatePremium =
            false;


        if (
            transactionStatus ===
            "settlement"
        ) {

            paymentStatus =
                "paid";

            activatePremium =
                true;

        }


        else if (
            transactionStatus ===
            "capture"
        ) {

            /*
                Untuk kartu kredit.

                Capture hanya dianggap berhasil
                jika fraud_status = accept
                atau fraud_status tidak diberikan.
            */

            if (
                !fraudStatus ||
                fraudStatus ===
                "accept"
            ) {

                paymentStatus =
                    "paid";

                activatePremium =
                    true;

            } else {

                paymentStatus =
                    "challenge";

            }

        }


        else if (
            transactionStatus ===
            "pending"
        ) {

            paymentStatus =
                "pending";

        }


        else if (
            transactionStatus ===
            "deny"
        ) {

            paymentStatus =
                "denied";

        }


        else if (
            transactionStatus ===
            "cancel"
        ) {

            paymentStatus =
                "cancelled";

        }


        else if (
            transactionStatus ===
            "expire"
        ) {

            paymentStatus =
                "expired";

        }


        else if (
            transactionStatus ===
            "failure"
        ) {

            paymentStatus =
                "failed";

        }


        else if (
            transactionStatus ===
            "refund" ||
            transactionStatus ===
            "partial_refund"
        ) {

            paymentStatus =
                "refunded";

        }



        /* =================================================
           ACTIVATE PREMIUM ATOMICALLY
        ================================================= */

        if (activatePremium) {

            const {
                data,
                error
            } =

                await supabaseAdmin

                    .rpc(
                        "activate_enginex_payment",
                        {

                            p_order_id:
                                orderId,

                            p_transaction_id:
                                body.transaction_id ||
                                null,

                            p_payment_type:
                                body.payment_type ||
                                null

                        }
                    );


            if (error) {

                console.error(
                    "Premium activation error:",
                    error
                );


                return res
                    .status(500)
                    .json({

                        message:
                            "Unable to activate premium."

                    });

            }


            return res
                .status(200)
                .json({

                    success:
                        true,

                    status:
                        "paid",

                    activation:
                        data

                });

        }



        /* =================================================
           UPDATE NON-PAID STATUS
        ================================================= */

        const {
            error:
            updateError
        } =

            await supabaseAdmin

                .from(
                    "payments"
                )

                .update({

                    status:
                        paymentStatus,

                    transaction_status:
                        transactionStatus,

                    transaction_id:
                        body.transaction_id ||
                        null,

                    payment_type:
                        body.payment_type ||
                        null,

                    fraud_status:
                        fraudStatus ||
                        null,

                    updated_at:
                        new Date()
                            .toISOString()

                })

                .eq(
                    "order_id",
                    orderId
                );


        if (updateError) {

            console.error(
                "Payment update error:",
                updateError
            );


            return res
                .status(500)
                .json({

                    message:
                        "Unable to update payment."

                });

        }



        return res
            .status(200)
            .json({

                success:
                    true,

                status:
                    paymentStatus

            });


    } catch (error) {

        console.error(
            "Webhook error:",
            error
        );


        return res
            .status(500)
            .json({

                message:
                    "Internal server error."

            });

    }

};