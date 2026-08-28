const {
    createClient
} = require("@supabase/supabase-js");

const crypto = require("crypto");


const supabaseAdmin =
    createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );


const PLANS = {

    premium_monthly: {
        days: 30
    },

    premium_yearly: {
        days: 365
    }

};


module.exports = async function handler(
    req,
    res
) {

    if (req.method !== "POST") {

        return res.status(405).json({
            message: "Method not allowed"
        });

    }


    try {

        const notification =
            req.body || {};


        const {

            order_id,

            transaction_id,

            transaction_status,

            fraud_status,

            status_code,

            gross_amount,

            signature_key,

            payment_type

        } = notification;


        /* =========================
           VALIDATION
        ========================= */

        if (
            !order_id ||
            !status_code ||
            !gross_amount ||
            !signature_key
        ) {

            return res.status(400).json({
                message:
                    "Invalid notification."
            });

        }


        /* =========================
           VERIFY SIGNATURE
        ========================= */

        const signatureInput =
            order_id +
            status_code +
            gross_amount +
            process.env.MIDTRANS_SERVER_KEY;


        const expectedSignature =
            crypto
                .createHash("sha512")
                .update(signatureInput)
                .digest("hex");


        if (
            signature_key !==
            expectedSignature
        ) {

            console.warn(
                "Invalid Midtrans signature."
            );


            return res.status(403).json({
                message:
                    "Invalid signature."
            });

        }


        /* =========================
           GET PAYMENT
        ========================= */

        const {

            data: payment,

            error: paymentError

        } =
            await supabaseAdmin
                .from("payments")
                .select("*")
                .eq(
                    "order_id",
                    order_id
                )
                .single();


        if (
            paymentError ||
            !payment
        ) {

            return res.status(404).json({
                message:
                    "Payment not found."
            });

        }


        /* =========================
           IDEMPOTENCY
        ========================= */

        if (
            payment.status ===
                "paid"
        ) {

            return res.status(200).json({
                status:
                    "already_processed"
            });

        }


        /* =========================
           DETERMINE STATUS
        ========================= */

        let newStatus =
            "pending";


        const isSuccessful =
            transaction_status ===
                "settlement"

            ||

            (
                transaction_status ===
                    "capture"

                &&

                (
                    !fraud_status
                    ||
                    fraud_status
                        .toLowerCase()
                        ===
                        "accept"
                )
            );


        if (isSuccessful) {

            newStatus =
                "paid";

        }


        else if (

            transaction_status ===
                "cancel"

            ||

            transaction_status ===
                "deny"

            ||

            transaction_status ===
                "expire"

        ) {

            newStatus =
                "failed";

        }


        /* =========================
           UPDATE PAYMENT
        ========================= */

        const {

            error: updateError

        } =
            await supabaseAdmin
                .from("payments")
                .update({

                    transaction_id:
                        transaction_id
                        ||
                        null,

                    status:
                        newStatus,

                    payment_type:
                        payment_type
                        ||
                        null,

                    paid_at:
                        newStatus ===
                            "paid"

                            ?

                            new Date()
                                .toISOString()

                            :

                            null

                })
                .eq(
                    "order_id",
                    order_id
                );


        if (updateError) {

            console.error(
                updateError
            );

            return res.status(500).json({
                message:
                    "Failed to update payment."
            });

        }


        /* =========================
           ACTIVATE PREMIUM
        ========================= */

        if (
            newStatus ===
            "paid"
        ) {

            const plan =
                PLANS[
                    payment.plan
                ];


            if (!plan) {

                return res.status(400).json({
                    message:
                        "Invalid Premium plan."
                });

            }


            const {

                data: profile,

                error: profileError

            } =
                await supabaseAdmin
                    .from("profiles")
                    .select(
                        "plan,premium_until"
                    )
                    .eq(
                        "id",
                        payment.user_id
                    )
                    .single();


            if (profileError) {

                console.error(
                    profileError
                );

                return res.status(500).json({
                    message:
                        "Profile not found."
                });

            }


            const now =
                new Date();


            let startDate =
                now;


            if (
                profile.premium_until
            ) {

                const existingDate =
                    new Date(
                        profile.premium_until
                    );


                if (
                    existingDate >
                    now
                ) {

                    startDate =
                        existingDate;

                }

            }


            const expiration =
                new Date(
                    startDate.getTime()
                    +
                    plan.days *
                    24 *
                    60 *
                    60 *
                    1000
                );


            const {

                error: premiumError

            } =
                await supabaseAdmin
                    .from("profiles")
                    .update({

                        plan:
                            "premium",

                        premium_until:
                            expiration
                                .toISOString(),

                        updated_at:
                            now.toISOString()

                    })
                    .eq(
                        "id",
                        payment.user_id
                    );


            if (premiumError) {

                console.error(
                    premiumError
                );

                return res.status(500).json({
                    message:
                        "Failed to activate Premium."
                });

            }

        }


        return res.status(200).json({
            status: "ok"
        });


    } catch (error) {

        console.error(
            "Notification error:",
            error
        );


        return res.status(500).json({
            message:
                "Notification processing failed."
        });

    }

};
