const { createClient } = require("@supabase/supabase-js");
const crypto = require("crypto");


/* =========================================================
   SUPABASE ADMIN
========================================================= */

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


/* =========================================================
   PREMIUM PLANS
========================================================= */

/*
    Frontend kita mengirim:
    "monthly"
    "yearly"
*/

const PLANS = {

    monthly: {
        id: "premium_monthly",
        name: "Enginex Premium 1 Month",
        amount: 19900,
        days: 30
    },

    yearly: {
        id: "premium_yearly",
        name: "Enginex Premium 1 Year",
        amount: 149900,
        days: 365
    }

};


/* =========================================================
   HANDLER
========================================================= */

module.exports = async function handler(req, res) {


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
        "Content-Type, Authorization"
    );


    /* =====================================================
       PREFLIGHT
    ===================================================== */

    if (req.method === "OPTIONS") {

        return res
            .status(200)
            .end();

    }


    /* =====================================================
       ONLY POST
    ===================================================== */

    if (req.method !== "POST") {

        return res
            .status(405)
            .json({

                message:
                    "Method not allowed"

            });

    }


    try {


        /* =================================================
           CHECK ENVIRONMENT VARIABLES
        ================================================= */

        if (
            !process.env.SUPABASE_URL ||
            !process.env.SUPABASE_SERVICE_ROLE_KEY
        ) {

            console.error(
                "Supabase environment variables missing."
            );


            return res
                .status(500)
                .json({

                    message:
                        "Supabase server configuration error."

                });

        }


        if (
            !process.env.MIDTRANS_SERVER_KEY
        ) {

            console.error(
                "MIDTRANS_SERVER_KEY missing."
            );


            return res
                .status(500)
                .json({

                    message:
                        "Payment server configuration error."

                });

        }



        /* =================================================
           AUTHORIZATION HEADER
        ================================================= */

        const authorization =
            req.headers.authorization || "";


        if (
            !authorization.startsWith(
                "Bearer "
            )
        ) {

            return res
                .status(401)
                .json({

                    message:
                        "Authorization token required."

                });

        }



        /* =================================================
           GET ACCESS TOKEN
        ================================================= */

        const accessToken =
            authorization
                .replace(
                    "Bearer ",
                    ""
                )
                .trim();


        if (!accessToken) {

            return res
                .status(401)
                .json({

                    message:
                        "Invalid authorization token."

                });

        }



        /* =================================================
           VERIFY SUPABASE USER
        ================================================= */

        const {
            data: userData,
            error: userError
        } =
            await supabaseAdmin.auth
                .getUser(
                    accessToken
                );


        if (
            userError ||
            !userData?.user
        ) {

            console.error(
                "Supabase auth error:",
                userError
            );


            return res
                .status(401)
                .json({

                    message:
                        "Invalid or expired login session."

                });

        }


        const user =
            userData.user;



        /* =================================================
           GET BODY
        ================================================= */

        const body =
            typeof req.body === "string"
                ? JSON.parse(req.body)
                : req.body || {};


        const planKey =
            body.plan;



        /* =================================================
           VALIDATE PLAN
        ================================================= */

        if (
            !planKey ||
            !PLANS[planKey]
        ) {

            return res
                .status(400)
                .json({

                    message:
                        "Invalid premium plan."

                });

        }


        const selectedPlan =
            PLANS[planKey];



        /* =================================================
           USER EMAIL
        ================================================= */

        const customerEmail =
            user.email;


        if (!customerEmail) {

            return res
                .status(400)
                .json({

                    message:
                        "User email unavailable."

                });

        }



        /* =================================================
           USER NAME
        ================================================= */

        let customerName =
            user.user_metadata
                ?.full_name ||
            user.user_metadata
                ?.name ||
            "Enginex User";


        try {

            const {
                data: profile
            } =
                await supabaseAdmin

                    .from("profiles")

                    .select(
                        "full_name"
                    )

                    .eq(
                        "id",
                        user.id
                    )

                    .maybeSingle();


            if (
                profile?.full_name
            ) {

                customerName =
                    profile.full_name;

            }

        } catch (profileError) {

            console.warn(
                "Profile name lookup failed:",
                profileError
            );

        }



        /* =================================================
           GENERATE UNIQUE ORDER ID
        ================================================= */

        const randomPart =
            crypto
                .randomBytes(5)
                .toString("hex");


        const timestamp =
            Date.now();


        const orderId =
            `ENGINEX-${planKey}-${timestamp}-${randomPart}`;


        /*
            Midtrans order ID maximum is limited,
            so keep it reasonably short.
        */



        /* =================================================
           MIDTRANS REQUEST BODY
        ================================================= */

        const midtransPayload = {

            transaction_details: {

                order_id:
                    orderId,

                gross_amount:
                    selectedPlan.amount

            },


            item_details: [

                {

                    id:
                        selectedPlan.id,

                    price:
                        selectedPlan.amount,

                    quantity:
                        1,

                    name:
                        selectedPlan.name

                }

            ],


            customer_details: {

                first_name:
                    customerName,

                email:
                    customerEmail

            },


            custom_field1:
                user.id,

            custom_field2:
                planKey

        };



        /* =================================================
           MIDTRANS BASIC AUTH
        ================================================= */

        const midtransAuthorization =
            Buffer
                .from(
                    `${process.env.MIDTRANS_SERVER_KEY}:`
                )
                .toString(
                    "base64"
                );



        /* =================================================
           ENVIRONMENT
        ================================================= */

        /*
            Default = sandbox.

            Jika nanti sudah production,
            tambahkan Environment Variable:

            MIDTRANS_IS_PRODUCTION=true
        */

        const isProduction =
            process.env.MIDTRANS_IS_PRODUCTION ===
            "true";


        const midtransUrl =
            isProduction

                ? "https://app.midtrans.com/snap/v1/transactions"

                : "https://app.sandbox.midtrans.com/snap/v1/transactions";



        /* =================================================
           CREATE SNAP TRANSACTION
        ================================================= */

        const midtransResponse =
            await fetch(
                midtransUrl,
                {

                    method:
                        "POST",

                    headers: {

                        "Accept":
                            "application/json",

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Basic ${midtransAuthorization}`

                    },

                    body:
                        JSON.stringify(
                            midtransPayload
                        )

                }
            );



        /* =================================================
           READ MIDTRANS RESPONSE
        ================================================= */

        const midtransText =
            await midtransResponse.text();


        let midtransData = {};


        try {

            midtransData =
                midtransText
                    ? JSON.parse(
                        midtransText
                    )
                    : {};

        } catch (parseError) {

            console.error(
                "Invalid Midtrans JSON:",
                midtransText
            );

        }



        /* =================================================
           MIDTRANS ERROR
        ================================================= */

        if (!midtransResponse.ok) {

            console.error(
                "Midtrans error:",
                midtransResponse.status,
                midtransData,
                midtransText
            );


            return res
                .status(
                    midtransResponse.status >= 400 &&
                    midtransResponse.status < 600

                        ? midtransResponse.status

                        : 500
                )
                .json({

                    message:
                        "Failed to create Midtrans transaction.",

                    midtrans_error:
                        midtransData

                });

        }



        /* =================================================
           VALIDATE MIDTRANS TOKEN
        ================================================= */

        if (
            !midtransData.token
        ) {

            console.error(
                "Midtrans token missing:",
                midtransData
            );


            return res
                .status(500)
                .json({

                    message:
                        "Midtrans payment token unavailable."

                });

        }



        /* =================================================
           SAVE TRANSACTION TO SUPABASE
        ================================================= */

        /*
            Ini opsional tetapi sangat disarankan.

            Buat tabel "payments" nanti untuk
            menyimpan transaksi.
        */

        try {

            const {
                error: paymentInsertError
            } =
                await supabaseAdmin

                    .from("payments")

                    .insert({

                        user_id:
                            user.id,

                        order_id:
                            orderId,

                        plan:
                            planKey,

                        amount:
                            selectedPlan.amount,

                        status:
                            "pending",

                        snap_token:
                            midtransData.token,

                        redirect_url:
                            midtransData.redirect_url || null

                    });


            if (paymentInsertError) {

                /*
                    Payment tetap boleh lanjut walaupun
                    tabel payments belum dibuat.
                */

                console.warn(
                    "Payment database insert failed:",
                    paymentInsertError
                );

            }

        } catch (paymentDatabaseError) {

            console.warn(
                "Payment database error:",
                paymentDatabaseError
            );

        }



        /* =================================================
           SUCCESS RESPONSE
        ================================================= */

        return res
            .status(200)
            .json({

                success:
                    true,

                token:
                    midtransData.token,

                redirect_url:
                    midtransData.redirect_url || null,

                order_id:
                    orderId,

                plan:
                    planKey,

                amount:
                    selectedPlan.amount

            });


    } catch (error) {


        /* =================================================
           SERVER ERROR
        ================================================= */

        console.error(
            "Payment API error:",
            error
        );


        return res
            .status(500)
            .json({

                message:
                    "Internal server error.",

                error:
                    process.env.NODE_ENV ===
                    "development"

                        ? error.message

                        : undefined

            });

    }

};
