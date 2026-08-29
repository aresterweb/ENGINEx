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
   PREMIUM PLANS
========================================================= */

const PLANS = {

    monthly: {

        id:
            "premium_monthly",

        name:
            "Enginex Premium 1 Month",

        amount:
            19900,

        days:
            30

    },


    yearly: {

        id:
            "premium_yearly",

        name:
            "Enginex Premium 1 Year",

        amount:
            149900,

        days:
            365

    }

};


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

        "Content-Type, Authorization"

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
                        "Supabase URL is not configured."

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
                        "Supabase service role key is not configured."

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
                        "Midtrans server key is not configured."

                });

        }



        /* =================================================
           AUTHORIZATION
        ================================================= */

        const authorization =
            req.headers
                .authorization ||
            "";


        if (
            !authorization
                .startsWith(
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


        const accessToken =
            authorization

                .replace(
                    "Bearer ",
                    ""
                )

                .trim();


        if (
            !accessToken
        ) {

            return res
                .status(401)
                .json({

                    message:
                        "Invalid authorization token."

                });

        }



        /* =================================================
           VERIFY USER
        ================================================= */

        const {
            data:
            userData,

            error:
            userError

        } =

            await supabaseAdmin
                .auth
                .getUser(
                    accessToken
                );


        if (
            userError ||
            !userData?.user
        ) {

            console.error(
                "User verification failed:",
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

            return res
                .status(400)
                .json({

                    message:
                        "Invalid request body."

                });

        }



        /* =================================================
           VALIDATE PLAN
        ================================================= */

        const planKey =
            body.plan;


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
            PLANS[
                planKey
            ];



        /* =================================================
           CHECK EXISTING PREMIUM
        ================================================= */

        const {
            data:
            profile,

            error:
            profileError

        } =

            await supabaseAdmin

                .from(
                    "profiles"
                )

                .select(
                    "full_name, plan, premium_until"
                )

                .eq(
                    "id",
                    user.id
                )

                .maybeSingle();


        if (
            profileError
        ) {

            console.error(
                "Profile lookup error:",
                profileError
            );

        }



        /* =================================================
           CUSTOMER DATA
        ================================================= */

        const customerEmail =
            user.email;


        if (
            !customerEmail
        ) {

            return res
                .status(400)
                .json({

                    message:
                        "User email unavailable."

                });

        }


        const customerName =

            profile?.full_name ||

            user.user_metadata
                ?.full_name ||

            user.user_metadata
                ?.name ||

            "Enginex User";



        /* =================================================
           ORDER ID
        ================================================= */

        const randomPart =
            crypto

                .randomBytes(4)

                .toString(
                    "hex"
                );


        const timestamp =
            Date.now();


        const orderId =

            `ENG-${planKey}-${timestamp}-${randomPart}`;



        /* =================================================
           MIDTRANS ENVIRONMENT
        ================================================= */

        const isProduction =

            String(
                process.env
                    .MIDTRANS_IS_PRODUCTION
            )
                .toLowerCase() ===
            "true";


        const midtransUrl =

            isProduction

                ? "https://app.midtrans.com/snap/v1/transactions"

                : "https://app.sandbox.midtrans.com/snap/v1/transactions";



        /* =================================================
           BASIC AUTH
        ================================================= */

        const basicAuth =
            Buffer

                .from(
                    `${process.env.MIDTRANS_SERVER_KEY}:`
                )

                .toString(
                    "base64"
                );



        /* =================================================
           MIDTRANS PAYLOAD
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
                planKey,

            custom_field3:
                String(
                    selectedPlan.days
                )

        };



        /* =================================================
           CREATE MIDTRANS TRANSACTION
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
                            `Basic ${basicAuth}`

                    },

                    body:
                        JSON.stringify(
                            midtransPayload
                        )

                }

            );



        const midtransText =
            await midtransResponse
                .text();


        let midtransData =
            {};


        try {

            midtransData =
                midtransText

                    ? JSON.parse(
                        midtransText
                    )

                    : {};

        } catch (
            parseError
        ) {

            console.error(
                "Midtrans response is not valid JSON:",
                midtransText
            );

        }



        /* =================================================
           MIDTRANS ERROR
        ================================================= */

        if (
            !midtransResponse.ok
        ) {

            console.error(
                "Midtrans error:",
                midtransResponse.status,
                midtransData
            );


            return res
                .status(502)
                .json({

                    message:
                        "Failed to create payment transaction.",

                    midtrans_status:
                        midtransResponse
                            .status

                });

        }



        /* =================================================
           VALIDATE MIDTRANS RESPONSE
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
                        "Payment token unavailable."

                });

        }



        /* =================================================
           SAVE PAYMENT TO SUPABASE
        ================================================= */

        /*
            Ini WAJIB berhasil.

            Webhook membutuhkan order_id ini
            untuk mengaktifkan Premium.
        */

        const {
            error:
            paymentInsertError

        } =

            await supabaseAdmin

                .from(
                    "payments"
                )

                .insert({

                    user_id:
                        user.id,

                    order_id:
                        orderId,

                    plan:
                        planKey,

                    amount:
                        selectedPlan.amount,

                    duration_days:
                        selectedPlan.days,

                    status:
                        "pending",

                    transaction_status:
                        "pending",

                    snap_token:
                        midtransData.token,

                    redirect_url:
                        midtransData
                            .redirect_url ||
                        null,

                    premium_activated:
                        false

                });


        if (
            paymentInsertError
        ) {

            console.error(
                "Payment database insert failed:",
                paymentInsertError
            );


            /*
                Jangan kirim Snap token ke frontend
                kalau transaksi belum tersimpan.

                Jika token diberikan tetapi database
                tidak punya order_id, webhook tidak
                bisa mengaktifkan Premium.
            */

            return res
                .status(500)
                .json({

                    message:
                        "Unable to save payment transaction."

                });

        }



        /* =================================================
           SUCCESS
        ================================================= */

        return res
            .status(200)
            .json({

                success:
                    true,

                token:
                    midtransData.token,

                snap_token:
                    midtransData.token,

                redirect_url:
                    midtransData
                        .redirect_url ||
                    null,

                order_id:
                    orderId,

                plan:
                    planKey,

                amount:
                    selectedPlan.amount,

                duration_days:
                    selectedPlan.days,

                environment:
                    isProduction
                        ? "production"
                        : "sandbox"

            });


    } catch (
        error
    ) {


        /* =================================================
           UNKNOWN SERVER ERROR
        ================================================= */

        console.error(
            "Payment API error:",
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
