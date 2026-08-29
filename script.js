/* =========================================================
   ENGINEX - MAIN SCRIPT
   Complete Version
   ========================================================= */


/* =========================================================
   1. CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://xruphwixbafbfqtpjqor.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_BUYtrhS1y1Y2vGLdeVFSqw_IKGnu7i-";

const BACKEND_URL =
    "https://enginex-ls0ib1aeg-engine-x1.vercel.app";


/* =========================================================
   2. SUPABASE CLIENT
========================================================= */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =========================================================
   3. GLOBAL STATE
========================================================= */

let currentUser = null;

let currentProfile = null;

let currentTool = null;

let paymentProcessing = false;


/*
    false = Indonesia
    true  = English
*/

let english =
    localStorage.getItem("enginex_language") === "en";


/* =========================================================
   4. TRANSLATIONS
========================================================= */

const translations = {

    id: {

        language: "EN",

        home: "Beranda",

        tools: "Tools",

        dashboard: "Dashboard",

        premium: "Premium",

        login: "Login",

        logout: "Logout",

        register: "Daftar",

        loginTitle: "Login",

        registerTitle: "Buat Akun",

        email: "Email",

        password: "Password",

        name: "Nama",

        loginButton: "Login",

        registerButton: "Daftar",

        upgrade: "Upgrade Premium",

        monthly: "Premium 1 Bulan",

        yearly: "Premium 1 Tahun",

        monthlyPrice: "Rp19.900",

        yearlyPrice: "Rp149.900",

        buyMonthly: "Beli Premium 1 Bulan",

        buyYearly: "Beli Premium 1 Tahun",

        timeCalculator: "Kalkulator Waktu",

        fuelCalculator: "Kalkulator Bahan Bakar",

        advancedEngineering:
            "Engineering Lanjutan",

        calculate: "Hitung",

        startTime: "Waktu Mulai",

        endTime: "Waktu Selesai",

        fuel: "Bahan Bakar",

        hours: "Jam",

        liters: "Liter",

        result: "Hasil",

        duration: "Durasi",

        consumption: "Konsumsi",

        free: "FREE",

        premiumPlan: "PREMIUM",

        premiumUntil:
            "Premium sampai",

        account:
            "Akun",

        history:
            "Riwayat",

        noHistory:
            "Belum ada perhitungan.",

        historyError:
            "Tidak dapat memuat riwayat.",

        preparingPayment:
            "Mempersiapkan pembayaran...",

        paymentSuccess:
            "Pembayaran berhasil. Premium sedang diproses.",

        paymentPending:
            "Pembayaran masih menunggu.",

        paymentFailed:
            "Pembayaran gagal.",

        checkoutClosed:
            "Checkout ditutup.",

        loginFirst:
            "Login terlebih dahulu.",

        invalidPlan:
            "Paket Premium tidak valid.",

        calculationSaved:
            "Perhitungan berhasil disimpan.",

        accountCreated:
            "Akun berhasil dibuat.",

        verifyEmail:
            "Akun dibuat. Periksa email untuk verifikasi.",

        loginSuccess:
            "Login berhasil.",

        logoutSuccess:
            "Berhasil logout.",

        completeData:
            "Lengkapi semua data.",

        passwordShort:
            "Password minimal 6 karakter.",

        enterLogin:
            "Masukkan email dan password.",

        enterBothTime:
            "Masukkan kedua waktu.",

        invalidValue:
            "Masukkan nilai yang valid.",

        invalidTime:
            "Waktu selesai harus setelah waktu mulai.",

        paymentError:
            "Gagal membuat pembayaran.",

        tokenError:
            "Token pembayaran tidak tersedia.",

        serverError:
            "Terjadi kesalahan pada server.",

        englishMode:
            "English mode aktif.",

        indonesiaMode:
            "Mode Bahasa Indonesia aktif.",

        timeDescription:
            "Hitung durasi antara dua waktu.",

        fuelDescription:
            "Hitung konsumsi bahan bakar rata-rata.",

        advancedDescription:
            "Fitur engineering lanjutan untuk pengguna Premium.",

        premiumOnly:
            "Fitur ini hanya tersedia untuk pengguna Premium.",

        alreadyPremium:
            "Akun Anda sudah Premium.",

        profileError:
            "Tidak dapat memuat profil.",

        sessionError:
            "Tidak dapat memuat sesi login.",

        networkError:
            "Gagal terhubung ke server.",

        paymentOpened:
            "Halaman pembayaran dibuka.",

        unknownError:
            "Terjadi kesalahan.",

        averageFuel:
            "Rata-rata konsumsi bahan bakar",

        totalHours:
            "Total jam",

        totalFuel:
            "Total bahan bakar"

    },


    en: {

        language: "ID",

        home: "Home",

        tools: "Tools",

        dashboard: "Dashboard",

        premium: "Premium",

        login: "Login",

        logout: "Logout",

        register: "Register",

        loginTitle: "Login",

        registerTitle: "Create Account",

        email: "Email",

        password: "Password",

        name: "Name",

        loginButton: "Login",

        registerButton: "Register",

        upgrade: "Upgrade Premium",

        monthly: "Premium 1 Month",

        yearly: "Premium 1 Year",

        monthlyPrice: "$1.30",

        yearlyPrice: "$9.90",

        buyMonthly:
            "Buy Premium 1 Month",

        buyYearly:
            "Buy Premium 1 Year",

        timeCalculator:
            "Time Calculator",

        fuelCalculator:
            "Fuel Calculator",

        advancedEngineering:
            "Advanced Engineering",

        calculate:
            "Calculate",

        startTime:
            "Start Time",

        endTime:
            "End Time",

        fuel:
            "Fuel",

        hours:
            "Hours",

        liters:
            "Liters",

        result:
            "Result",

        duration:
            "Duration",

        consumption:
            "Consumption",

        free:
            "FREE",

        premiumPlan:
            "PREMIUM",

        premiumUntil:
            "Premium until",

        account:
            "Account",

        history:
            "History",

        noHistory:
            "No calculations yet.",

        historyError:
            "Unable to load history.",

        preparingPayment:
            "Preparing payment...",

        paymentSuccess:
            "Payment successful. Premium is being processed.",

        paymentPending:
            "Payment is pending.",

        paymentFailed:
            "Payment failed.",

        checkoutClosed:
            "Checkout closed.",

        loginFirst:
            "Please login first.",

        invalidPlan:
            "Invalid Premium plan.",

        calculationSaved:
            "Calculation saved.",

        accountCreated:
            "Account created successfully.",

        verifyEmail:
            "Account created. Check your email for verification.",

        loginSuccess:
            "Login successful.",

        logoutSuccess:
            "Successfully logged out.",

        completeData:
            "Please complete all fields.",

        passwordShort:
            "Password must be at least 6 characters.",

        enterLogin:
            "Enter email and password.",

        enterBothTime:
            "Enter both times.",

        invalidValue:
            "Enter valid values.",

        invalidTime:
            "End time must be after start time.",

        paymentError:
            "Failed to create payment.",

        tokenError:
            "Payment token unavailable.",

        serverError:
            "Server error occurred.",

        englishMode:
            "English mode enabled.",

        indonesiaMode:
            "Indonesian mode enabled.",

        timeDescription:
            "Calculate the duration between two times.",

        fuelDescription:
            "Calculate average fuel consumption.",

        advancedDescription:
            "Advanced engineering features for Premium users.",

        premiumOnly:
            "This feature is available for Premium users only.",

        alreadyPremium:
            "Your account is already Premium.",

        profileError:
            "Unable to load profile.",

        sessionError:
            "Unable to load login session.",

        networkError:
            "Unable to connect to server.",

        paymentOpened:
            "Payment page opened.",

        unknownError:
            "An error occurred.",

        averageFuel:
            "Average fuel consumption",

        totalHours:
            "Total hours",

        totalFuel:
            "Total fuel"

    }

};


/* =========================================================
   5. LANGUAGE HELPER
========================================================= */

function t(key) {

    const language =
        english
            ? "en"
            : "id";

    return (
        translations[language]?.[key] ??
        key
    );

}


/* =========================================================
   6. INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        applyLanguage();

        await loadSession();

        registerServiceWorker();

    }
);


/* =========================================================
   7. SERVICE WORKER
========================================================= */

async function registerServiceWorker() {

    if (
        !("serviceWorker" in navigator)
    ) {

        return;

    }


    try {

        await navigator.serviceWorker.register(
            "/sw.js"
        );

    } catch (error) {

        console.warn(
            "Service worker error:",
            error
        );

    }

}


/* =========================================================
   8. AUTH STATE CHANGE
========================================================= */

supabaseClient.auth.onAuthStateChange(

    async (
        event,
        session
    ) => {

        currentUser =
            session?.user || null;

        await updateUI();

    }

);


/* =========================================================
   9. LOAD SESSION
========================================================= */

async function loadSession() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .getSession();


        if (error) {

            console.error(error);

            showToast(
                t("sessionError")
            );

            return;

        }


        currentUser =
            data.session?.user || null;


        await updateUI();

    } catch (error) {

        console.error(
            "Session error:",
            error
        );

    }

}


/* =========================================================
   10. UPDATE UI
========================================================= */

async function updateUI() {

    const loginButton =
        document.getElementById(
            "loginButton"
        );

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );

    const dashboardNav =
        document.getElementById(
            "dashboardNav"
        );


    if (currentUser) {

        loginButton
            ?.classList
            .add("hidden");

        logoutButton
            ?.classList
            .remove("hidden");

        dashboardNav
            ?.classList
            .remove("hidden");


        await loadProfile();

    } else {

        loginButton
            ?.classList
            .remove("hidden");

        logoutButton
            ?.classList
            .add("hidden");

        dashboardNav
            ?.classList
            .add("hidden");


        currentProfile = null;

        setText(
            "userEmail",
            "-"
        );

        setText(
            "userPlan",
            t("free")
        );

        setText(
            "premiumUntil",
            "-"
        );

    }


    applyLanguage();

}


/* =========================================================
   11. LANGUAGE SWITCH
========================================================= */

function toggleLanguage() {

    english = !english;


    localStorage.setItem(

        "enginex_language",

        english
            ? "en"
            : "id"

    );


    applyLanguage();


    showToast(

        english
            ? t("englishMode")
            : t("indonesiaMode")

    );

}


/* =========================================================
   12. APPLY LANGUAGE
========================================================= */

function applyLanguage() {

    const language =
        english
            ? "en"
            : "id";


    document.documentElement.lang =
        language;


    const languageButton =
        document.getElementById(
            "languageButton"
        );


    if (languageButton) {

        languageButton.textContent =
            translations[language].language;

    }


    /*
        Normal text
    */

    document
        .querySelectorAll(
            "[data-i18n]"
        )
        .forEach(element => {

            const key =
                element.getAttribute(
                    "data-i18n"
                );


            if (
                key &&
                translations[language][key] !== undefined
            ) {

                element.textContent =
                    translations[language][key];

            }

        });


    /*
        Placeholder
    */

    document
        .querySelectorAll(
            "[data-i18n-placeholder]"
        )
        .forEach(element => {

            const key =
                element.getAttribute(
                    "data-i18n-placeholder"
                );


            if (
                key &&
                translations[language][key] !== undefined
            ) {

                element.placeholder =
                    translations[language][key];

            }

        });


    /*
        Title attribute
    */

    document
        .querySelectorAll(
            "[data-i18n-title]"
        )
        .forEach(element => {

            const key =
                element.getAttribute(
                    "data-i18n-title"
                );


            if (
                key &&
                translations[language][key] !== undefined
            ) {

                element.title =
                    translations[language][key];

            }

        });


    setText(
        "loginButton",
        t("login")
    );

    setText(
        "logoutButton",
        t("logout")
    );

    setText(
        "dashboardNav",
        t("dashboard")
    );


    setText(
        "userPlan",

        currentProfile?.plan === "premium"
            ? t("premiumPlan")
            : t("free")

    );


    /*
        Refresh opened tool
    */

    if (currentTool) {

        updateToolLanguage(
            currentTool
        );

    }

}


/* =========================================================
   13. SAFE SET TEXT
========================================================= */

function setText(
    id,
    text
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            text;

    }

}


/* =========================================================
   14. REGISTER
========================================================= */

async function register() {

    const name =
        document
            .getElementById(
                "registerName"
            )
            ?.value
            .trim();


    const email =
        document
            .getElementById(
                "registerEmail"
            )
            ?.value
            .trim();


    const password =
        document
            .getElementById(
                "registerPassword"
            )
            ?.value;


    if (
        !name ||
        !email ||
        !password
    ) {

        showToast(
            t("completeData")
        );

        return;

    }


    if (
        password.length < 6
    ) {

        showToast(
            t("passwordShort")
        );

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .signUp({

                    email,

                    password,

                    options: {

                        data: {

                            full_name:
                                name

                        }

                    }

                });


        if (error) {

            showToast(
                error.message
            );

            return;

        }


        closeAuth();


        if (
            data.session
        ) {

            showToast(
                t("accountCreated")
            );

        } else {

            showToast(
                t("verifyEmail")
            );

        }

    } catch (error) {

        console.error(error);

        showToast(
            t("unknownError")
        );

    }

}


/* =========================================================
   15. LOGIN
========================================================= */

async function login() {

    const email =
        document
            .getElementById(
                "loginEmail"
            )
            ?.value
            .trim();


    const password =
        document
            .getElementById(
                "loginPassword"
            )
            ?.value;


    if (
        !email ||
        !password
    ) {

        showToast(
            t("enterLogin")
        );

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .signInWithPassword({

                    email,

                    password

                });


        if (error) {

            showToast(
                error.message
            );

            return;

        }


        currentUser =
            data.user;


        closeAuth();


        showPage(
            "dashboard"
        );


        showToast(
            t("loginSuccess")
        );


        await updateUI();

    } catch (error) {

        console.error(error);

        showToast(
            t("unknownError")
        );

    }

}


/* =========================================================
   16. LOGOUT
========================================================= */

async function logout() {

    try {

        const {
            error
        } =
            await supabaseClient.auth
                .signOut();


        if (error) {

            showToast(
                error.message
            );

            return;

        }


        currentUser = null;

        currentProfile = null;


        showPage(
            "home"
        );


        showToast(
            t("logoutSuccess")
        );


        await updateUI();

    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   17. LOAD PROFILE
========================================================= */

async function loadProfile() {

    if (!currentUser) {

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient

                .from("profiles")

                .select("*")

                .eq(
                    "id",
                    currentUser.id
                )

                .maybeSingle();


        if (error) {

            console.error(
                "Profile error:",
                error
            );

            return;

        }


        /*
            Profile belum ada.
            Kita tetap biarkan login berjalan.
        */

        currentProfile =
            data || {

                id:
                    currentUser.id,

                plan:
                    "free",

                premium_until:
                    null

            };


        setText(

            "userEmail",

            currentUser.email || "-"

        );


        setText(

            "userPlan",

            currentProfile.plan === "premium"
                ? t("premiumPlan")
                : t("free")

        );


        setText(

            "premiumUntil",

            currentProfile.premium_until
                ? formatDate(
                    currentProfile.premium_until
                )
                : "-"

        );


        await loadHistory();

    } catch (error) {

        console.error(
            "Profile error:",
            error
        );

    }

}


/* =========================================================
   18. LOAD HISTORY
========================================================= */

async function loadHistory() {

    const historyList =
        document.getElementById(
            "historyList"
        );


    if (
        !historyList ||
        !currentUser
    ) {

        return;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient

                .from("calculations")

                .select("*")

                .eq(
                    "user_id",
                    currentUser.id
                )

                .order(
                    "created_at",
                    {
                        ascending:
                            false
                    }
                )

                .limit(10);


        if (error) {

            console.error(error);

            historyList.innerHTML =
                `
                <p class="muted">
                    ${escapeHTML(
                        t("historyError")
                    )}
                </p>
                `;

            return;

        }


        if (
            !data ||
            data.length === 0
        ) {

            historyList.innerHTML =
                `
                <p class="muted">
                    ${escapeHTML(
                        t("noHistory")
                    )}
                </p>
                `;

            return;

        }


        historyList.innerHTML =
            data
                .map(item => {

                    return `
                    <div
                        class="dashboard-card"
                        style="margin-bottom:10px"
                    >

                        <strong>
                            ${escapeHTML(
                                item.tool_name ||
                                "-"
                            )}
                        </strong>

                        <span>
                            ${formatDate(
                                item.created_at
                            )}
                        </span>

                    </div>
                    `;

                })
                .join("");

    } catch (error) {

        console.error(
            "History error:",
            error
        );

    }

}


/* =========================================================
   19. SAVE CALCULATION
========================================================= */

async function saveCalculation(
    toolName,
    inputData,
    resultData
) {

    if (!currentUser) {

        return;

    }


    try {

        const {
            error
        } =
            await supabaseClient

                .from("calculations")

                .insert({

                    user_id:
                        currentUser.id,

                    tool_name:
                        toolName,

                    input_data:
                        inputData,

                    result_data:
                        resultData

                });


        if (error) {

            console.error(
                "Save calculation:",
                error
            );

            return;

        }


        await loadHistory();

    } catch (error) {

        console.error(error);

    }

}


/* =========================================================
   20. PAGE NAVIGATION
========================================================= */

function showPage(page) {

    const pages = [

        "homePage",

        "toolsPage",

        "dashboardPage",

        "premiumPage",

        "toolPage"

    ];


    pages.forEach(id => {

        document
            .getElementById(id)
            ?.classList
            .remove("active");

    });


    /*
        Dashboard requires login
    */

    if (
        page === "dashboard" &&
        !currentUser
    ) {

        openAuth("login");

        return;

    }


    const target =
        document.getElementById(
            page + "Page"
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    window.scrollTo({

        top: 0,

        behavior:
            "smooth"

    });


    if (
        page === "dashboard" &&
        currentUser
    ) {

        loadProfile();

    }


    applyLanguage();

}


/* =========================================================
   21. OPEN TOOL
========================================================= */

function openTool(type) {

    currentTool =
        type;


    /*
        Advanced requires Premium
    */

    if (
        type === "advanced" &&
        currentProfile?.plan !== "premium"
    ) {

        showToast(
            t("premiumOnly")
        );

        showPage(
            "premium"
        );

        return;

    }


    showPage(
        "tool"
    );


    document
        .querySelectorAll(
            ".calculator"
        )
        .forEach(element => {

            element.classList.add(
                "hidden"
            );

        });


    if (
        type === "time"
    ) {

        document
            .getElementById(
                "timeCalculator"
            )
            ?.classList
            .remove("hidden");

    }


    if (
        type === "fuel"
    ) {

        document
            .getElementById(
                "fuelCalculator"
            )
            ?.classList
            .remove("hidden");

    }


    if (
        type === "advanced"
    ) {

        document
            .getElementById(
                "advancedCalculator"
            )
            ?.classList
            .remove("hidden");

    }


    updateToolLanguage(
        type
    );

}


/* =========================================================
   22. TOOL LANGUAGE
========================================================= */

function updateToolLanguage(type) {

    const title =
        document.getElementById(
            "toolTitle"
        );

    const description =
        document.getElementById(
            "toolDescription"
        );


    if (
        type === "time"
    ) {

        if (title) {

            title.textContent =
                t("timeCalculator");

        }


        if (description) {

            description.textContent =
                t("timeDescription");

        }

    }


    if (
        type === "fuel"
    ) {

        if (title) {

            title.textContent =
                t("fuelCalculator");

        }


        if (description) {

            description.textContent =
                t("fuelDescription");

        }

    }


    if (
        type === "advanced"
    ) {

        if (title) {

            title.textContent =
                t("advancedEngineering");

        }


        if (description) {

            description.textContent =
                t("advancedDescription");

        }

    }

}


/* =========================================================
   23. TIME CALCULATOR
========================================================= */

async function calculateTime() {

    const startElement =
        document.getElementById(
            "startTime"
        );

    const endElement =
        document.getElementById(
            "endTime"
        );


    const resultElement =
        document.getElementById(
            "timeResult"
        );


    if (
        !startElement ||
        !endElement
    ) {

        return;

    }


    const startValue =
        startElement.value;

    const endValue =
        endElement.value;


    if (
        !startValue ||
        !endValue
    ) {

        showToast(
            t("enterBothTime")
        );

        return;

    }


    const start =
        new Date(startValue);

    const end =
        new Date(endValue);


    if (
        isNaN(start.getTime()) ||
        isNaN(end.getTime())
    ) {

        showToast(
            t("invalidValue")
        );

        return;

    }


    if (
        end <= start
    ) {

        showToast(
            t("invalidTime")
        );

        return;

    }


    const milliseconds =
        end - start;


    const totalMinutes =
        Math.floor(
            milliseconds /
            60000
        );


    const days =
        Math.floor(
            totalMinutes /
            1440
        );


    const hours =
        Math.floor(
            (
                totalMinutes %
                1440
            ) /
            60
        );


    const minutes =
        totalMinutes % 60;


    const totalHours =
        milliseconds /
        3600000;


    const resultText =
        english
            ?
            `${days} day(s), ${hours} hour(s), ${minutes} minute(s) — ${totalHours.toFixed(2)} hours`
            :
            `${days} hari, ${hours} jam, ${minutes} menit — ${totalHours.toFixed(2)} jam`;


    if (resultElement) {

        resultElement.textContent =
            resultText;

    }


    await saveCalculation(

        english
            ? "Time Calculator"
            : "Kalkulator Waktu",

        {

            start:
                startValue,

            end:
                endValue

        },

        {

            days,

            hours,

            minutes,

            total_hours:
                Number(
                    totalHours.toFixed(2)
                )

        }

    );

}


/* =========================================================
   24. FUEL CALCULATOR
========================================================= */

async function calculateFuel() {

    const fuelElement =
        document.getElementById(
            "fuelAmount"
        );


    const hoursElement =
        document.getElementById(
            "fuelHours"
        );


    const resultElement =
        document.getElementById(
            "fuelResult"
        );


    if (
        !fuelElement ||
        !hoursElement
    ) {

        return;

    }


    const fuel =
        Number(
            fuelElement.value
        );


    const hours =
        Number(
            hoursElement.value
        );


    if (
        !Number.isFinite(fuel) ||
        !Number.isFinite(hours) ||
        fuel < 0 ||
        hours <= 0
    ) {

        showToast(
            t("invalidValue")
        );

        return;

    }


    const average =
        fuel / hours;


    const resultText =
        english
            ?
            `${average.toFixed(2)} liters/hour`
            :
            `${average.toFixed(2)} liter/jam`;


    if (resultElement) {

        resultElement.textContent =
            resultText;

    }


    await saveCalculation(

        english
            ? "Fuel Calculator"
            : "Kalkulator Bahan Bakar",

        {

            fuel,

            hours

        },

        {

            average_liters_per_hour:
                Number(
                    average.toFixed(2)
                )

        }

    );

}


/* =========================================================
   25. PREMIUM PAYMENT
========================================================= */

/*
    plan:
    "monthly"
    "yearly"
*/

async function buyPremium(plan) {

    if (
        paymentProcessing
    ) {

        return;

    }


    if (
        !currentUser
    ) {

        showToast(
            t("loginFirst")
        );

        openAuth(
            "login"
        );

        return;

    }


    if (
        plan !== "monthly" &&
        plan !== "yearly"
    ) {

        showToast(
            t("invalidPlan")
        );

        return;

    }


    paymentProcessing =
        true;


    showToast(
        t("preparingPayment")
    );


    try {

        /*
            Ambil session terbaru Supabase.
        */

        const {
            data:
            sessionData,

            error:
            sessionError

        } =
            await supabaseClient.auth
                .getSession();


        if (sessionError) {

            throw sessionError;

        }


        const accessToken =
            sessionData
                ?.session
                ?.access_token;


        if (!accessToken) {

            paymentProcessing =
                false;

            showToast(
                t("loginFirst")
            );

            return;

        }


        /*
            PAYMENT API

            IMPORTANT:
            Selalu POST.
        */

        const response =
            await fetch(

                `${BACKEND_URL}/api/payment`,

                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${accessToken}`

                    },

                    body:
                        JSON.stringify({

                            plan,

                            user_id:
                                currentUser.id,

                            email:
                                currentUser.email

                        })

                }

            );


        /*
            Baca response aman meskipun backend
            mengembalikan text/error HTML.
        */

        const responseText =
            await response.text();


        let data = {};


        try {

            data =
                responseText
                    ? JSON.parse(
                        responseText
                    )
                    : {};

        } catch {

            console.error(
                "Payment raw response:",
                responseText
            );

        }


        if (!response.ok) {

            console.error(
                "Payment API error:",
                response.status,
                data,
                responseText
            );


            const message =
                data?.message ||
                data?.error ||
                `${t("paymentError")} (${response.status})`;


            showToast(
                message
            );


            paymentProcessing =
                false;

            return;

        }


        /*
            Mendukung beberapa nama response backend.
        */

        const snapToken =
            data.token ||
            data.snap_token ||
            data.snapToken ||
            data.payment_token;


        const redirectUrl =
            data.redirect_url ||
            data.redirectUrl ||
            data.payment_url ||
            data.url;


        /*
            MIDTRANS SNAP
        */

        if (
            snapToken &&
            window.snap
        ) {

            window.snap.pay(

                snapToken,

                {

                    onSuccess:
                        async function (
                            result
                        ) {

                            console.log(
                                "Payment success:",
                                result
                            );


                            showToast(
                                t("paymentSuccess")
                            );


                            paymentProcessing =
                                false;


                            await refreshPremiumStatus();

                        },


                    onPending:
                        function (
                            result
                        ) {

                            console.log(
                                "Payment pending:",
                                result
                            );


                            showToast(
                                t("paymentPending")
                            );


                            paymentProcessing =
                                false;

                        },


                    onError:
                        function (
                            result
                        ) {

                            console.error(
                                "Payment failed:",
                                result
                            );


                            showToast(
                                t("paymentFailed")
                            );


                            paymentProcessing =
                                false;

                        },


                    onClose:
                        function () {

                            showToast(
                                t("checkoutClosed")
                            );


                            paymentProcessing =
                                false;

                        }

                }

            );


            return;

        }


        /*
            Jika backend mengembalikan URL
            pembayaran.
        */

        if (redirectUrl) {

            paymentProcessing =
                false;


            window.location.href =
                redirectUrl;


            return;

        }


        /*
            Kalau backend sukses tetapi token
            tidak ada.
        */

        console.error(
            "Payment response:",
            data
        );


        showToast(
            t("tokenError")
        );


        paymentProcessing =
            false;

    } catch (error) {

        console.error(
            "Payment error:",
            error
        );


        showToast(
            t("networkError")
        );


        paymentProcessing =
            false;

    }

}


/* =========================================================
   26. PAYMENT ALIASES
========================================================= */

/*
    Agar HTML lama tetap bisa memakai
    fungsi berbeda.
*/

function startPayment(plan) {

    return buyPremium(
        plan
    );

}


function createPayment(plan) {

    return buyPremium(
        plan
    );

}


function upgradePremium(plan) {

    return buyPremium(
        plan
    );

}


/* =========================================================
   27. REFRESH PREMIUM STATUS
========================================================= */

async function refreshPremiumStatus() {

    /*
        Webhook payment mungkin membutuhkan
        beberapa detik untuk memperbarui database.

        Kita refresh profile langsung.
    */

    await loadProfile();


    if (
        currentProfile?.plan === "premium"
    ) {

        applyLanguage();

    }

}


/* =========================================================
   28. AUTH MODAL
========================================================= */

function openAuth(
    mode = "login"
) {

    const modal =
        document.getElementById(
            "authModal"
        );


    if (!modal) {

        console.warn(
            "authModal not found"
        );

        return;

    }


    modal.classList.remove(
        "hidden"
    );


    modal.classList.add(
        "active"
    );


    switchAuth(
        mode
    );

}


/* =========================================================
   29. CLOSE AUTH
========================================================= */

function closeAuth() {

    const modal =
        document.getElementById(
            "authModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "hidden"
    );


    modal.classList.remove(
        "active"
    );

}


/* =========================================================
   30. SWITCH AUTH FORM
========================================================= */

function switchAuth(mode) {

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    const registerForm =
        document.getElementById(
            "registerForm"
        );


    if (
        mode === "register"
    ) {

        loginForm
            ?.classList
            .add("hidden");


        registerForm
            ?.classList
            .remove("hidden");

    } else {

        registerForm
            ?.classList
            .add("hidden");


        loginForm
            ?.classList
            .remove("hidden");

    }


    applyLanguage();

}


/* =========================================================
   31. FORMAT DATE
========================================================= */

function formatDate(value) {

    if (!value) {

        return "-";

    }


    const date =
        new Date(value);


    if (
        isNaN(date.getTime())
    ) {

        return "-";

    }


    try {

        return new Intl
            .DateTimeFormat(

                english
                    ? "en-US"
                    : "id-ID",

                {

                    dateStyle:
                        "medium",

                    timeStyle:
                        "short"

                }

            )
            .format(date);

    } catch {

        return date
            .toLocaleString();

    }

}


/* =========================================================
   32. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   33. TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

    let toast =
        document.getElementById(
            "toast"
        );


    /*
        Kalau HTML belum punya toast,
        script akan membuatnya sendiri.
    */

    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "toast";


        toast.style.position =
            "fixed";

        toast.style.bottom =
            "24px";

        toast.style.left =
            "50%";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.zIndex =
            "99999";

        toast.style.background =
            "#222";

        toast.style.color =
            "#fff";

        toast.style.padding =
            "12px 18px";

        toast.style.borderRadius =
            "10px";

        toast.style.maxWidth =
            "90%";

        toast.style.textAlign =
            "center";

        toast.style.display =
            "none";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.style.display =
        "block";


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast
                    .classList
                    .remove("show");


                toast.style.display =
                    "none";

            },

            3000

        );

}


/* =========================================================
   34. CLICK OUTSIDE MODAL
========================================================= */

document.addEventListener(

    "click",

    event => {

        const modal =
            document.getElementById(
                "authModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeAuth();

        }

    }

);


/* =========================================================
   35. ESC CLOSE MODAL
========================================================= */

document.addEventListener(

    "keydown",

    event => {

        if (
            event.key === "Escape"
        ) {

            closeAuth();

        }

    }

);


/* =========================================================
   END ENGINEX SCRIPT
========================================================= */
