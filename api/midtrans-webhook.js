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
       CORS
    ===================================================== */

    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, OPTIONS"
    );

    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type"
    );


    /* =====================================================
       PREFLIGHT
    ===================================================== */

    if (
        req.method ===
        "OPTIONS"
    ) {

        return res
            .status(200)
            .end();

    }


    /* =====================================================
       ONLY POST
    ===================================================== */

    if (
        req.method !==
        "POST"
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
           CHECK ENVIRONMENT
        ================================================= */

        if (
            !process.env
                .SUPABASE_URL
        ) {

            console.error(
                "SUPABASE_URL missing."
            );


            return res
                .status(500)
                .json({

                    message:
                        "Supabase URL not configured."

                });

        }


        if (
            !process.env
                .SUPABASE_SERVICE_ROLE_KEY
        ) {

            console.error(
                "SUPABASE_SERVICE_ROLE_KEY missing."
            );


            return res
                .status(500)
                .json({

                    message:
                        "Supabase service role key not configured."

                });

        }


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
                        "Midtrans server key not configured."

                });

        }



        /* =================================================
           READ BODY
        ================================================= */

        let body = {};


        try {

            body =
                typeof req.body ===
                "string"

                    ? JSON.parse(
                        req.body
                    )

                    : req.body || {};

        } catch (
            parseError
        ) {

            console.error(
                "Invalid webhook JSON:",
                parseError
            );


            return res
                .status(400)
                .json({

                    message:
                        "Invalid JSON body."

                });

        }



        /* =================================================
           READ MIDTRANS DATA
        ================================================= */

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
           MIDTRANS DASHBOARD TEST NOTIFICATION
        ================================================= */

        /*
            Saat tombol "Tes URL notifikasi"
            di dashboard Midtrans ditekan,
            Midtrans membuat Order ID seperti:

            payment_notif_test_Mxxxxx_...

            Order ini memang tidak ada
            di database payments.

            Jadi kita cukup membalas HTTP 200
            agar Midtrans mengetahui endpoint
            webhook dapat dijangkau.
        */

        if (
            orderId &&
            orderId.startsWith(
                "payment_notif_test_"
            )
        ) {

            console.log(
                "Midtrans notification URL test received:",
                orderId
            );


            return res
                .status(200)
                .json({

                    success:
                        true,

                    test:
                        true,

                    message:
                        "Midtrans notification test received."

                });

        }



        /* =================================================
           VALIDATE REQUIRED DATA
        ================================================= */

        if (
            !orderId ||
            !statusCode ||
            !grossAmount ||
            !transactionStatus ||
            !signatureKey
        ) {

            console.error(
                "Incomplete Midtrans notification:",
                body
            );


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

            String(
                orderId
            ) +

            String(
                statusCode
            ) +

            String(
                grossAmount
            ) +

            String(
                process.env
                    .MIDTRANS_SERVER_KEY
            );


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


        const receivedSignature =
            String(
                signatureKey
            );


        if (
            expectedSignature.length !==
            receivedSignature.length
        ) {

            console.error(
                "Midtrans signature length mismatch:",
                orderId
            );


            return res
                .status(401)
                .json({

                    message:
                        "Invalid signature."

                });

        }


        const signatureValid =

            crypto.timingSafeEqual(

                Buffer.from(
                    expectedSignature
                ),

                Buffer.from(
                    receivedSignature
                )

            );


        if (
            !signatureValid
        ) {

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
            data:
            payment,

            error:
            paymentError

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
            paymentError
        ) {

            console.error(
                "Payment lookup error:",
                paymentError
            );


            return res
                .status(500)
                .json({

                    message:
                        "Unable to read payment."

                });

        }


        if (
            !payment
        ) {

            console.error(
                "Payment not found:",
                orderId
            );


            return res
                .status(404)
                .json({

                    message:
                        "Payment not found."

                });

        }



        /* =================================================
           VERIFY PAYMENT AMOUNT
        ================================================= */

        const paidAmount =

            Math.round(
                Number(
                    grossAmount
                )
            );


        const expectedAmount =

            Number(
                payment.amount
            );


        if (
            !Number.isFinite(
                paidAmount
            ) ||
            paidAmount !==
            expectedAmount
        ) {

            console.error(
                "Payment amount mismatch:",
                {

                    orderId:
                        orderId,

                    expected:
                        expectedAmount,

                    received:
                        grossAmount

                }
            );


            return res
                .status(400)
                .json({

                    message:
                        "Payment amount mismatch."

                });

        }



        /* =================================================
           MAP MIDTRANS STATUS
        ================================================= */

        let paymentStatus =
            "pending";


        let shouldActivatePremium =
            false;



        /* =================================================
           SETTLEMENT
        ================================================= */

        if (
            transactionStatus ===
            "settlement"
        ) {

            paymentStatus =
                "paid";

            shouldActivatePremium =
                true;

        }



        /* =================================================
           CAPTURE
        ================================================= */

        else if (
            transactionStatus ===
            "capture"
        ) {

            if (
                !fraudStatus ||
                fraudStatus ===
                "accept"
            ) {

                paymentStatus =
                    "paid";

                shouldActivatePremium =
                    true;

            }

            else {

                paymentStatus =
                    "challenge";

            }

        }



        /* =================================================
           PENDING
        ================================================= */

        else if (
            transactionStatus ===
            "pending"
        ) {

            paymentStatus =
                "pending";

        }



        /* =================================================
           DENY
        ================================================= */

        else if (
            transactionStatus ===
            "deny"
        ) {

            paymentStatus =
                "denied";

        }



        /* =================================================
           CANCEL
        ================================================= */

        else if (
            transactionStatus ===
            "cancel"
        ) {

            paymentStatus =
                "cancelled";

        }



        /* =================================================
           EXPIRE
        ================================================= */

        else if (
            transactionStatus ===
            "expire"
        ) {

            paymentStatus =
                "expired";

        }



        /* =================================================
           FAILURE
        ================================================= */

        else if (
            transactionStatus ===
            "failure"
        ) {

            paymentStatus =
                "failed";

        }



        /* =================================================
           REFUND
        ================================================= */

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
           ACTIVATE PREMIUM
        ================================================= */

        if (
            shouldActivatePremium
        ) {

            /*
                Fungsi database ini harus sudah dibuat
                lewat SQL sebelumnya:

                activate_enginex_payment()
            */

            const {
                data:
                activationData,

                error:
                activationError

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


            if (
                activationError
            ) {

                console.error(
                    "Premium activation error:",
                    activationError
                );


                return res
                    .status(500)
                    .json({

                        message:
                            "Unable to activate premium."

                    });

            }


            console.log(
                "Premium activated:",
                {

                    orderId:
                        orderId,

                    userId:
                        payment.user_id,

                    activation:
                        activationData

                }
            );


            return res
                .status(200)
                .json({

                    success:
                        true,

                    status:
                        "paid",

                    premium:
                        true,

                    activation:
                        activationData

                });

        }



        /* =================================================
           UPDATE NON-SUCCESS STATUS
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


        if (
            updateError
        ) {

            console.error(
                "Payment status update failed:",
                updateError
            );


            return res
                .status(500)
                .json({

                    message:
                        "Unable to update payment status."

                });

        }



        /* =================================================
           SUCCESS RESPONSE
        ================================================= */

        console.log(
            "Midtrans webhook processed:",
            {

                orderId:
                    orderId,

                transactionStatus:
                    transactionStatus,

                paymentStatus:
                    paymentStatus

            }
        );


        return res
            .status(200)
            .json({

                success:
                    true,

                order_id:
                    orderId,

                transaction_status:
                    transactionStatus,

                status:
                    paymentStatus

            });


    } catch (
        error
    ) {


        /* =================================================
           UNKNOWN ERROR
        ================================================= */

        console.error(
            "Midtrans webhook error:",
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
