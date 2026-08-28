const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");

const supabaseAdmin = createClient(
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
        name: "Enginex Premium 1 Month",
        amount: 19900,
        days: 30
    },

    premium_yearly: {
        name: "Enginex Premium 1 Year",
        amount: 149900,
        days: 365
    }
};

module.exports = async function handler(req, res) {

    /* =========================
       CORS
    ========================= */

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
        "Content-Type, Authorization"
    );

    /* =========================
       PREFLIGHT
    ========================= */

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    /* =========================
       ONLY POST
    ========================= */

    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed"
        });
    }

    try {

        /* =========================
           CHECK ENVIRONMENT
        ========================= */

        if (
            !process.env.SUPABASE_URL ||
            !process.env.SUPABASE_SERVICE_ROLE_KEY
        ) {
            console.error(
                "Supabase environment variables missing."
            );

            return res.status(500).json({
                message:
                    "Server configuration error."
            });
        }

        if (
            !process.env.MIDTRANS_SERVER_KEY
        ) {
            console.error(
                "Midtrans Server Key missing."
            );

            return res.status(500).json({
                message:
                    "Payment configuration error."
            });
        }

        /* =========================
           AUTHORIZATION
        ========================= */

        const authorization =
            req.headers.authorization || "";

        if (
            !authorization.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                message:
                    "Authorization required"
            });
        }

        const accessToken =
            authorization.substring(7);

        const {
            data: userData,
            error: userError
        } =
            await supabaseAdmin.auth.getUser(
                accessToken
            );

        if (
            userError ||
            !userData ||
            !userData.user
        ) {
            return res.status(401).json({
                message:
                    "Invalid authentication"
            });
        }

        const user =
            userData.user;

        /* =========================
           PLAN
        ========================= */

        const plan =
            req.body?.plan;

        const selectedPlan =
            PLANS[plan];

        if (!selectedPlan) {
            return res.status(400).json({
                message:
                    "Premium plan tidak valid."
            });
        }

        /* =========================
           ORDER ID
        ========================= */

        const orderId =
            "ENGINEX-" +
            Date.now() +
            "-" +
            crypto
                .randomBytes(4)
                .toString("hex")
                .toUpperCase();

        /* =========================
           SAVE PAYMENT
        ========================= */

        const {
            error: insertError
        } =
            await supabaseAdmin
                .from("payments")
                .insert({
                    user_id:
                        user.id,

                    order_id:
                        orderId,

                    plan:
                        plan,

                    amount:
                        selectedPlan.amount,

                    status:
                        "pending"
                });

        if (insertError) {

            console.error(
                "Payment insert error:",
                insertError
            );

            return res.status(500).json({
                message:
                    "Gagal menyimpan transaksi."
            });
        }

        /* =========================
           MIDTRANS MODE
        ========================= */

        const isProduction =
            process.env
                .MIDTRANS_IS_PRODUCTION ===
            "true";

        const midtransUrl =
            isProduction
                ? "https://app.midtrans.com/snap/v1/transactions"
                : "https://app.sandbox.midtrans.com/snap/v1/transactions";

        /* =========================
           MIDTRANS AUTH
        ========================= */

        const authorizationKey =
            Buffer
                .from(
                    process.env
                        .MIDTRANS_SERVER_KEY +
                    ":"
                )
                .toString("base64");

        /* =========================
           CREATE SNAP TRANSACTION
        ========================= */

        const midtransResponse =
            await fetch(
                midtransUrl,
                {
                    method: "POST",

                    headers: {
                        "Accept":
                            "application/json",

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Basic " +
                            authorizationKey
                    },

                    body: JSON.stringify({

                        transaction_details: {
                            order_id:
                                orderId,

                            gross_amount:
                                selectedPlan.amount
                        },

                        item_details: [
                            {
                                id:
                                    plan,

                                price:
                                    selectedPlan.amount,

                                quantity: 1,

                                name:
                                    selectedPlan.name
                            }
                        ],

                        customer_details: {

                            first_name:
                                user
                                    .user_metadata
                                    ?.full_name
                                ||
                                "Enginex User",

                            email:
                                user.email
                        },

                        custom_field1:
                            user.id,

                        custom_field2:
                            plan
                    })
                }
            );

        const result =
            await midtransResponse.json();

        /* =========================
           MIDTRANS ERROR
        ========================= */

        if (!midtransResponse.ok) {

            console.error(
                "Midtrans error:",
                result
            );

            await supabaseAdmin
                .from("payments")
                .update({
                    status:
                        "failed"
                })
                .eq(
                    "order_id",
                    orderId
                );

            return res.status(500).json({
                message:
                    "Midtrans gagal membuat pembayaran."
            });
        }

        /* =========================
           SUCCESS
        ========================= */

        return res.status(200).json({

            token:
                result.token,

            redirect_url:
                result.redirect_url,

            order_id:
                orderId
        });

    } catch (error) {

        console.error(
            "Payment function error:",
            error
        );

        return res.status(500).json({
            message:
                "Terjadi kesalahan pada server."
        });
    }
};
