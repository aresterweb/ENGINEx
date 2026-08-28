/* =========================================================
   ENGINEX - MAIN SCRIPT
   ========================================================= */

/* =========================
   CONFIGURATION
========================= */

const SUPABASE_URL =
    "https://xruphwixbafbfqtpjqor.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_BUYtrhS1y1Y2vGLdeVFSqw_IKGnu7i-";

/*
   Backend Vercel
*/
const BACKEND_URL =
    "https://enginex-ls0ib1aeg-engine-x1.vercel.app";


/* =========================
   SUPABASE
========================= */

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =========================
   GLOBAL STATE
========================= */

let currentUser = null;
let currentProfile = null;


/*
   Default language:
   false = Indonesia
   true  = English
*/

let english =
    localStorage.getItem("enginex_language") === "en";


/* =========================
   TRANSLATIONS
========================= */

const translations = {

    id: {

        language: "EN",

        login: "Login",
        logout: "Logout",
        register: "Daftar",
        dashboard: "Dashboard",
        premium: "Premium",
        home: "Beranda",
        tools: "Tools",

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

        timeCalculator: "Time Calculator",
        fuelCalculator: "Fuel Calculator",
        advancedEngineering: "Advanced Engineering",

        calculate: "Hitung",

        startTime: "Waktu Mulai",
        endTime: "Waktu Selesai",

        fuel: "Bahan Bakar",
        hours: "Jam",

        free: "FREE",
        premiumPlan: "PREMIUM",

        premiumUntil: "Premium sampai",

        noHistory: "Belum ada perhitungan.",
        historyError: "Tidak dapat memuat riwayat.",

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
            "Mode Bahasa Indonesia aktif."

    },


    en: {

        language: "ID",

        login: "Login",
        logout: "Logout",
        register: "Register",
        dashboard: "Dashboard",
        premium: "Premium",
        home: "Home",
        tools: "Tools",

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

        timeCalculator: "Time Calculator",
        fuelCalculator: "Fuel Calculator",
        advancedEngineering: "Advanced Engineering",

        calculate: "Calculate",

        startTime: "Start Time",
        endTime: "End Time",

        fuel: "Fuel",
        hours: "Hours",

        free: "FREE",
        premiumPlan: "PREMIUM",

        premiumUntil: "Premium until",

        noHistory: "No calculations yet.",
        historyError: "Unable to load history.",

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
            "Indonesian mode enabled."

    }

};


/* =========================
   LANGUAGE HELPER
========================= */

function t(key) {

    const language =
        english ? "en" : "id";

    return (
        translations[language][key] ||
        key
    );
}


/* =========================
   INITIALIZATION
========================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        applyLanguage();

        await loadSession();

        if ("serviceWorker" in navigator) {

            try {

                await navigator.serviceWorker.register(
                    "sw.js"
                );

            } catch (error) {

                console.log(
                    "Service worker:",
                    error
                );

            }

        }

    }
);


/* =========================
   AUTH STATE
========================= */

supabaseClient.auth.onAuthStateChange(
    async (event, session) => {

        currentUser =
            session?.user || null;

        await updateUI();

    }
);


/* =========================
   SESSION
========================= */

async function loadSession() {

    const {
        data,
        error
    } =
        await supabaseClient.auth.getSession();


    if (error) {

        console.error(error);

        return;
    }


    currentUser =
        data.session?.user || null;


    await updateUI();
}


/* =========================
   UI UPDATE
========================= */

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

        if (loginButton) {

            loginButton.classList.add(
                "hidden"
            );

        }


        if (logoutButton) {

            logoutButton.classList.remove(
                "hidden"
            );

        }


        if (dashboardNav) {

            dashboardNav.classList.remove(
                "hidden"
            );

        }


        await loadProfile();

    } else {

        if (loginButton) {

            loginButton.classList.remove(
                "hidden"
            );

        }


        if (logoutButton) {

            logoutButton.classList.add(
                "hidden"
            );

        }


        if (dashboardNav) {

            dashboardNav.classList.add(
                "hidden"
            );

        }


        currentProfile = null;

    }

}


/* =========================
   LANGUAGE
========================= */

function toggleLanguage() {

    english = !english;


    localStorage.setItem(
        "enginex_language",
        english ? "en" : "id"
    );


    applyLanguage();


    showToast(
        english
            ? t("englishMode")
            : t("indonesiaMode")
    );

}


/* =========================
   APPLY LANGUAGE
========================= */

function applyLanguage() {

    const language =
        english ? "en" : "id";


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
       Elements using data-i18n
    */

    document
        .querySelectorAll(
            "[data-i18n]"
        )
        .forEach(element => {

            const key =
                element.dataset.i18n;


            if (
                translations[language][key]
            ) {

                element.textContent =
                    translations[language][key];

            }

        });


    /*
       Placeholder translations
    */

    document
        .querySelectorAll(
            "[data-i18n-placeholder]"
        )
        .forEach(element => {

            const key =
                element.dataset.i18nPlaceholder;


            if (
                translations[language][key]
            ) {

                element.placeholder =
                    translations[language][key];

            }

        });


    /*
       Known existing elements
    */

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

}


/* =========================
   SAFE TEXT
========================= */

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


/* =========================
   REGISTER
========================= */

async function register() {

    const name =
        document.getElementById(
            "registerName"
        )?.value.trim();


    const email =
        document.getElementById(
            "registerEmail"
        )?.value.trim();


    const password =
        document.getElementById(
            "registerPassword"
        )?.value;


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


    const {
        data,
        error
    } =
        await supabaseClient.auth.signUp({

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


    if (data.session) {

        showToast(
            t("accountCreated")
        );

    } else {

        showToast(
            t("verifyEmail")
        );

    }

}


/* =========================
   LOGIN
========================= */

async function login() {

    const email =
        document.getElementById(
            "loginEmail"
        )?.value.trim();


    const password =
        document.getElementById(
            "loginPassword"
        )?.value;


    if (
        !email ||
        !password
    ) {

        showToast(
            t("enterLogin")
        );

        return;
    }


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
}


/* =========================
   LOGOUT
========================= */

async function logout() {

    const {
        error
    } =
        await supabaseClient.auth.signOut();


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
}


/* =========================
   PROFILE
========================= */

async function loadProfile() {

    if (!currentUser) return;


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
            .single();


    if (error) {

        console.error(
            "Profile error:",
            error
        );

        return;
    }


    currentProfile =
        data;


    const email =
        document.getElementById(
            "userEmail"
        );

    const plan =
        document.getElementById(
            "userPlan"
        );

    const premiumUntil =
        document.getElementById(
            "premiumUntil"
        );


    if (email) {

        email.textContent =
            currentUser.email ||
            "-";

    }


    if (plan) {

        plan.textContent =
            data.plan === "premium"
                ? t("premiumPlan")
                : t("free");

    }


    if (premiumUntil) {

        premiumUntil.textContent =
            data.premium_until
                ? formatDate(
                    data.premium_until
                )
                : "-";

    }


    await loadHistory();
}


/* =========================
   HISTORY
========================= */

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
                    ascending: false
                }
            )
            .limit(10);


    if (error) {

        historyList.innerHTML =
            `<p class="muted">
                ${t("historyError")}
            </p>`;

        return;
    }


    if (
        !data ||
        data.length === 0
    ) {

        historyList.innerHTML =
            `<p class="muted">
                ${t("noHistory")}
            </p>`;

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
                                item.tool_name
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
}


/* =========================
   SAVE CALCULATION
========================= */

async function saveCalculation(
    toolName,
    inputData,
    resultData
) {

    if (!currentUser) {

        return;
    }


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
            "History error:",
            error
        );

        return;
    }


    await loadHistory();
}


/* =========================
   PAGE NAVIGATION
========================= */

function showPage(page) {

    const pages = [

        "homePage",

        "toolsPage",

        "dashboardPage",

        "premiumPage",

        "toolPage"

    ];


    pages.forEach(id => {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.classList.remove(
                "active"
            );

        }

    });


    const target =
        document.getElementById(
            page + "Page"
        );


    if (target) {

        target.classList.add(
            "active"
        );


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }


    if (
        page === "dashboard"
    ) {

        if (!currentUser) {

            openAuth(
                "login"
            );

            return;
        }


        loadProfile();
    }

}


/* =========================
   TOOLS
========================= */

function openTool(type) {

    showPage("tool");


    const title =
        document.getElementById(
            "toolTitle"
        );

    const description =
        document.getElementById(
            "toolDescription"
        );


    document
        .querySelectorAll(
            ".calculator"
        )
        .forEach(el => {

            el.classList.add(
                "hidden"
            );

        });


    if (
        type === "time"
    ) {

        if (title) {

            title.textContent =
                t("timeCalculator");

        }


        if (description) {

            description.textContent =
                english
                    ? "Calculate the duration between two times."
                    : "Hitung durasi antara dua waktu.";

        }


        document
            .getElementById(
                "timeCalculator"
            )
            ?.classList.remove(
                "hidden"
            );

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
                english
                    ? "Calculate average fuel consumption."
                    : "Hitung konsumsi bahan bakar rata-rata.";

        }


        document
            .getElementById(
                "fuelCalculator"
            )
            ?.classList.remove(
                "hidden"
            );

    }


    if (
        type === "advanced"
    ) {

        title.textContent =
            t("advancedEngineering");


        description.textContent =
            english
                ? "Premium engineering tools."
                : "Tools engineering Premium.";


        document
            .getElementById(
                "advancedCalculator"
            )
            ?.classList.remove(
                "hidden"
            );

    }

}


/* =========================
   TIME CALCULATOR
========================= */

async function calculateTime() {

    const start =
        document.getElementById(
            "startTime"
        )?.value;


    const end =
        document.getElementById(
            "endTime"
        )?.value;


    if (
        !start ||
        !end
    ) {

        showToast(
            t("enterBothTime")
        );

        return;
    }


    const startDate =
        new Date(start);

    const endDate =
        new Date(end);


    const difference =
        endDate.getTime() -
        startDate.getTime();


    if (
        difference < 0
    ) {

        showToast(
            t("invalidTime")
        );

        return;
    }


    const totalMinutes =
        Math.floor(
            difference / 60000
        );


    const days =
        Math.floor(
            totalMinutes / 1440
        );


    const hours =
        Math.floor(
            (totalMinutes % 1440) /
            60
        );


    const minutes =
        totalMinutes % 60;


    const result =
        english

            ? `${days} days ${hours} hours ${minutes} minutes`

            : `${days} hari ${hours} jam ${minutes} menit`;


    const resultElement =
        document.getElementById(
            "timeResult"
        );


    if (resultElement) {

        resultElement.textContent =
            result;

    }


    await saveCalculation(

        "Time Calculator",

        {
            start,
            end
        },

        {
            result
        }

    );

}


/* =========================
   FUEL CALCULATOR
========================= */

async function calculateFuel() {

    const fuel =
        Number(
            document.getElementById(
                "fuelLiter"
            )?.value
        );


    const hours =
        Number(
            document.getElementById(
                "fuelHours"
            )?.value
        );


    if (
        !Number.isFinite(fuel) ||
        !Number.isFinite(hours) ||
        fuel <= 0 ||
        hours <= 0
    ) {

        showToast(
            t("invalidValue")
        );

        return;
    }


    const consumption =
        fuel / hours;


    const result =
        english

            ? `${consumption.toFixed(2)} L/hour`

            : `${consumption.toFixed(2)} L/jam`;


    const resultElement =
        document.getElementById(
            "fuelResult"
        );


    if (resultElement) {

        resultElement.textContent =
            result;

    }


    await saveCalculation(

        "Fuel Calculator",

        {
            fuel,
            hours
        },

        {
            consumption,
            result
        }

    );

}


/* =========================
   AUTH MODAL
========================= */

function openAuth(type) {

    document
        .getElementById(
            "authModal"
        )
        ?.classList.add(
            "active"
        );


    switchAuth(type);
}


function closeAuth() {

    document
        .getElementById(
            "authModal"
        )
        ?.classList.remove(
            "active"
        );
}


function switchAuth(type) {

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    const registerForm =
        document.getElementById(
            "registerForm"
        );


    if (
        type === "login"
    ) {

        loginForm?.classList.remove(
            "hidden"
        );

        registerForm?.classList.add(
            "hidden"
        );

    } else {

        loginForm?.classList.add(
            "hidden"
        );

        registerForm?.classList.remove(
            "hidden"
        );

    }

}


/* =========================
   PAYMENT
========================= */

async function startPayment(
    plan
) {

    if (!currentUser) {

        showToast(
            t("loginFirst")
        );

        openAuth(
            "login"
        );

        return;
    }


    try {

        showToast(
            t("preparingPayment")
        );


        const {
            data: sessionData,
            error: sessionError
        } =
            await supabaseClient.auth
                .getSession();


        if (sessionError) {

            throw sessionError;

        }


        const session =
            sessionData.session;


        if (!session) {

            showToast(
                t("loginFirst")
            );

            return;
        }


        /*
           IMPORTANT:
           Do not put Midtrans Server Key here.
        */

        const response =
            await fetch(
                `${BACKEND_URL}/api/payment`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${session.access_token}`

                    },

                    body:
                        JSON.stringify({
                            plan
                        })

                }
            );


        /*
           Try to read JSON safely
        */

        let result = null;

        try {

            result =
                await response.json();

        } catch (jsonError) {

            throw new Error(
                "Server returned an invalid response."
            );

        }


        if (!response.ok) {

            throw new Error(
                result?.message ||
                t("paymentError")
            );

        }


        if (
            !result ||
            !result.token
        ) {

            throw new Error(
                t("tokenError")
            );

        }


        loadMidtransSnap(
            result.token
        );


    } catch (error) {

        console.error(
            "PAYMENT ERROR:",
            error
        );


        /*
           More useful error
           than only "Failed to fetch"
        */

        if (
            error instanceof TypeError &&
            error.message ===
            "Failed to fetch"
        ) {

            showToast(
                english
                    ? "Unable to connect to payment server."
                    : "Tidak dapat terhubung ke server pembayaran."
            );

        } else {

            showToast(
                error.message ||
                t("serverError")
            );

        }

    }

}


/* =========================
   MIDTRANS SNAP
========================= */

function loadMidtransSnap(
    token
) {

    if (
        typeof window.snap ===
        "undefined"
    ) {

        const script =
            document.createElement(
                "script"
            );


        script.src =
            "https://app.sandbox.midtrans.com/snap/snap.js";


        /*
           Client Key only.
           NEVER use Server Key here.
        */

        script.setAttribute(
            "data-client-key",
            "Mid-client-bW5KoXwW-iFCJobn"
        );


        script.onload = () => {

            openSnap(
                token
            );

        };


        script.onerror = () => {

            showToast(
                english
                    ? "Unable to load Midtrans."
                    : "Tidak dapat memuat Midtrans."
            );

        };


        document.body.appendChild(
            script
        );

    } else {

        openSnap(
            token
        );

    }

}


/* =========================
   OPEN SNAP
========================= */

function openSnap(
    token
) {

    if (
        !window.snap
    ) {

        showToast(
            english
                ? "Payment system unavailable."
                : "Sistem pembayaran tidak tersedia."
        );

        return;
    }


    window.snap.pay(

        token,

        {

            onSuccess: () => {

                showToast(
                    t("paymentSuccess")
                );


                setTimeout(
                    () => {

                        if (
                            currentUser
                        ) {

                            loadProfile();

                        }

                    },
                    3000
                );

            },


            onPending: () => {

                showToast(
                    t("paymentPending")
                );

            },


            onError: () => {

                showToast(
                    t("paymentFailed")
                );

            },


            onClose: () => {

                showToast(
                    t("checkoutClosed")
                );

            }

        }

    );

}


/* =========================
   UTILITIES
========================= */

function formatDate(
    date
) {

    return new Date(date)
        .toLocaleDateString(

            english
                ? "en-US"
                : "id-ID",

            {

                day: "2-digit",

                month: "long",

                year: "numeric"

            }

        );

}


function escapeHTML(
    value
) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        console.log(
            message
        );

        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


/* =========================
   GLOBAL FUNCTIONS
========================= */

window.register =
    register;

window.login =
    login;

window.logout =
    logout;

window.openAuth =
    openAuth;

window.closeAuth =
    closeAuth;

window.switchAuth =
    switchAuth;

window.showPage =
    showPage;

window.openTool =
    openTool;

window.calculateTime =
    calculateTime;

window.calculateFuel =
    calculateFuel;

window.startPayment =
    startPayment;

window.toggleLanguage =
    toggleLanguage;

window.loadProfile =
    loadProfile;
