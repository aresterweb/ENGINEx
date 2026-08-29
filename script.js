/* =========================================================
   ENGINEX - MAIN SCRIPT
   Complete Version + Premium Engineering Tools
========================================================= */


/* =========================================================
   1. CONFIGURATION
========================================================= */

const SUPABASE_URL =
    "https://xruphwixbafbfqtpjqor.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_BUYtrhS1y1Y2vGLdeVFSqw_IKGnu7i-";

const BACKEND_URL =
    "https://engin-ex.vercel.app";


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

let currentPremiumTool = null;

let paymentProcessing = false;


/*
    false = Indonesia
    true  = English
*/

let english =
    localStorage.getItem(
        "enginex_language"
    ) === "en";


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

        buyMonthly:
            "Beli Premium 1 Bulan",

        buyYearly:
            "Beli Premium 1 Tahun",

        timeCalculator:
            "Kalkulator Waktu",

        fuelCalculator:
            "Kalkulator Bahan Bakar",

        advancedEngineering:
            "Engineering Lanjutan",

        calculate:
            "Hitung",

        back:
            "Kembali",

        startTime:
            "Waktu Mulai",

        endTime:
            "Waktu Selesai",

        fuel:
            "Bahan Bakar",

        hours:
            "Jam",

        liters:
            "Liter",

        result:
            "Hasil",

        duration:
            "Durasi",

        consumption:
            "Konsumsi",

        free:
            "FREE",

        premiumPlan:
            "PREMIUM",

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
            "Total bahan bakar",


        /* =============================================
           PREMIUM TOOLS
        ============================================== */

        premiumActive:
            "PREMIUM AKTIF",

        premiumToolsDescription:
            "Gunakan tools engineering Premium ENGINEX.",


        enginePower:
            "Engine Power",

        enginePowerDescription:
            "Hitung daya mesin berdasarkan torque dan RPM.",

        torque:
            "Torque",

        rpm:
            "RPM",

        enginePowerResult:
            "Daya Mesin",


        sfocCalculator:
            "SFOC Calculator",

        sfocDescription:
            "Hitung Specific Fuel Oil Consumption mesin.",

        fuelMass:
            "Massa Bahan Bakar",

        enginePowerInput:
            "Daya Mesin",

        operatingTime:
            "Waktu Operasi",

        sfocResult:
            "SFOC",


        shaftPower:
            "Shaft Power",

        shaftPowerDescription:
            "Hitung daya poros berdasarkan torque dan RPM.",

        shaftPowerResult:
            "Daya Poros",


        propellerSlip:
            "Propeller Slip",

        propellerSlipDescription:
            "Hitung slip propeller berdasarkan pitch, RPM, dan kecepatan kapal.",

        propellerPitch:
            "Pitch Propeller",

        propellerRPM:
            "RPM Propeller",

        actualSpeed:
            "Kecepatan Aktual Kapal",

        theoreticalSpeed:
            "Kecepatan Teoritis",

        propellerSlipResult:
            "Propeller Slip",


        compressionRatio:
            "Compression Ratio",

        compressionRatioDescription:
            "Hitung rasio kompresi dari swept volume dan clearance volume.",

        sweptVolume:
            "Swept Volume",

        clearanceVolume:
            "Clearance Volume",

        compressionRatioResult:
            "Rasio Kompresi",


        cylinderVolume:
            "Cylinder Volume",

        cylinderVolumeDescription:
            "Hitung total displacement mesin dari bore, stroke, dan jumlah silinder.",

        bore:
            "Diameter Bore",

        stroke:
            "Stroke",

        cylinders:
            "Jumlah Silinder",

        cylinderVolumeResult:
            "Total Displacement",


        pumpCapacity:
            "Pump Capacity",

        pumpCapacityDescription:
            "Hitung kapasitas pompa dari volume fluida dan waktu.",

        pumpedVolume:
            "Volume Fluida",

        pumpingTime:
            "Waktu Pemompaan",

        pumpCapacityResult:
            "Kapasitas Pompa",


        marineConverter:
            "Marine Unit Converter",

        marineConverterDescription:
            "Konversi unit teknik marine engineering.",

        conversionValue:
            "Nilai",

        fromUnit:
            "Dari Unit",

        toUnit:
            "Ke Unit",

        conversionResult:
            "Hasil Konversi",

        incompatibleUnits:
            "Unit tidak dapat dikonversi karena berbeda kategori.",

        premiumChecking:
            "Memeriksa status Premium...",

        premiumAccessActive:
            "Akses Premium aktif."

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

        registerTitle:
            "Create Account",

        email: "Email",

        password: "Password",

        name: "Name",

        loginButton: "Login",

        registerButton:
            "Register",

        upgrade:
            "Upgrade Premium",

        monthly:
            "Premium 1 Month",

        yearly:
            "Premium 1 Year",

        monthlyPrice:
            "$1.30",

        yearlyPrice:
            "$9.90",

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

        back:
            "Back",

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
            "Total fuel",


        /* =============================================
           PREMIUM TOOLS
        ============================================== */

        premiumActive:
            "PREMIUM ACTIVE",

        premiumToolsDescription:
            "Use ENGINEX Premium engineering tools.",


        enginePower:
            "Engine Power",

        enginePowerDescription:
            "Calculate engine power from torque and RPM.",

        torque:
            "Torque",

        rpm:
            "RPM",

        enginePowerResult:
            "Engine Power",


        sfocCalculator:
            "SFOC Calculator",

        sfocDescription:
            "Calculate Specific Fuel Oil Consumption.",

        fuelMass:
            "Fuel Mass",

        enginePowerInput:
            "Engine Power",

        operatingTime:
            "Operating Time",

        sfocResult:
            "SFOC",


        shaftPower:
            "Shaft Power",

        shaftPowerDescription:
            "Calculate shaft power from torque and RPM.",

        shaftPowerResult:
            "Shaft Power",


        propellerSlip:
            "Propeller Slip",

        propellerSlipDescription:
            "Calculate propeller slip from pitch, RPM and vessel speed.",

        propellerPitch:
            "Propeller Pitch",

        propellerRPM:
            "Propeller RPM",

        actualSpeed:
            "Actual Vessel Speed",

        theoreticalSpeed:
            "Theoretical Speed",

        propellerSlipResult:
            "Propeller Slip",


        compressionRatio:
            "Compression Ratio",

        compressionRatioDescription:
            "Calculate compression ratio from swept and clearance volume.",

        sweptVolume:
            "Swept Volume",

        clearanceVolume:
            "Clearance Volume",

        compressionRatioResult:
            "Compression Ratio",


        cylinderVolume:
            "Cylinder Volume",

        cylinderVolumeDescription:
            "Calculate total engine displacement from bore, stroke and cylinders.",

        bore:
            "Cylinder Bore",

        stroke:
            "Stroke",

        cylinders:
            "Number of Cylinders",

        cylinderVolumeResult:
            "Total Displacement",


        pumpCapacity:
            "Pump Capacity",

        pumpCapacityDescription:
            "Calculate pump capacity from fluid volume and pumping time.",

        pumpedVolume:
            "Fluid Volume",

        pumpingTime:
            "Pumping Time",

        pumpCapacityResult:
            "Pump Capacity",


        marineConverter:
            "Marine Unit Converter",

        marineConverterDescription:
            "Convert common marine engineering units.",

        conversionValue:
            "Value",

        fromUnit:
            "From Unit",

        toUnit:
            "To Unit",

        conversionResult:
            "Conversion Result",

        incompatibleUnits:
            "Units cannot be converted because they belong to different categories.",

        premiumChecking:
            "Checking Premium status...",

        premiumAccessActive:
            "Premium access active."

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

    english =
        !english;


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

        isPremiumActive()
            ? t("premiumPlan")
            : t("free")

    );


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

        currentProfile = null;

        return null;

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient

                .from("profiles")

                .select(
                    "id, full_name, plan, premium_until"
                )

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

            return null;

        }


        currentProfile =
            data || {

                id:
                    currentUser.id,

                full_name:
                    currentUser
                        .user_metadata
                        ?.full_name || "",

                plan:
                    "free",

                premium_until:
                    null

            };


        if (
            currentProfile?.plan === "premium" &&
            currentProfile?.premium_until
        ) {

            const expiry =
                new Date(
                    currentProfile.premium_until
                );


            if (
                expiry.getTime() <=
                Date.now()
            ) {

                currentProfile.plan =
                    "free";

            }

        }


        setText(

            "userEmail",

            currentUser.email || "-"

        );


        setText(

            "userPlan",

            isPremiumActive()
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


        return currentProfile;

    } catch (error) {

        console.error(
            "Profile error:",
            error
        );

        return null;

    }

}


/* =========================================================
   17A. PREMIUM CHECK
========================================================= */

function isPremiumActive() {

    if (!currentProfile) {

        return false;

    }


    if (
        currentProfile.plan !==
        "premium"
    ) {

        return false;

    }


    if (
        !currentProfile.premium_until
    ) {

        return false;

    }


    const expiry =
        new Date(
            currentProfile.premium_until
        );


    if (
        isNaN(
            expiry.getTime()
        )
    ) {

        return false;

    }


    return (
        expiry.getTime() >
        Date.now()
    );

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

        behavior: "smooth"

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

async function openTool(type) {

    currentTool =
        type;


    if (
        type === "advanced"
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


        const premium =
            await refreshPremiumStatus();


        if (!premium) {

            showToast(
                t("premiumOnly")
            );

            showPage(
                "premium"
            );

            return;

        }

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


        showPremiumToolsMenu();

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
            milliseconds / 60000
        );


    const days =
        Math.floor(
            totalMinutes / 1440
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

            ? `${days} day(s), ${hours} hour(s), ${minutes} minute(s) — ${totalHours.toFixed(2)} hours`

            : `${days} hari, ${hours} jam, ${minutes} menit — ${totalHours.toFixed(2)} jam`;


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
            ? `${average.toFixed(2)} liters/hour`
            : `${average.toFixed(2)} liter/jam`;


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

async function buyPremium(plan) {

    if (paymentProcessing) {

        return;

    }


    if (!currentUser) {

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


                            await waitForPremiumActivation();

                        },


                    onPending:
                        async function (
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


                            await waitForPremiumActivation();

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


        if (redirectUrl) {

            paymentProcessing =
                false;


            window.location.href =
                redirectUrl;


            return;

        }


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

    if (!currentUser) {

        return false;

    }


    await loadProfile();


    const premium =
        isPremiumActive();


    applyLanguage();


    return premium;

}


/* =========================================================
   27A. WAIT FOR PREMIUM ACTIVATION
========================================================= */

async function waitForPremiumActivation() {

    const maxAttempts =
        15;


    for (
        let attempt = 1;
        attempt <= maxAttempts;
        attempt++
    ) {

        const active =
            await refreshPremiumStatus();


        if (active) {

            showToast(

                english

                    ? "Premium activated successfully!"

                    : "Premium berhasil diaktifkan!"

            );


            showPage(
                "dashboard"
            );


            return true;

        }


        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    2000
                )
        );

    }


    showToast(

        english

            ? "Payment succeeded. Premium is still being activated. Please refresh shortly."

            : "Pembayaran berhasil. Premium sedang diaktifkan. Silakan refresh sebentar lagi."

    );


    return false;

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

    }

    else {

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
        isNaN(
            date.getTime()
        )
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


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "toast";


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
            event.key ===
            "Escape"
        ) {

            closeAuth();

        }

    }

);


/* =========================================================
   36. AUTO REFRESH PREMIUM
========================================================= */

window.addEventListener(
    "focus",
    async () => {

        if (currentUser) {

            await refreshPremiumStatus();

        }

    }
);


document.addEventListener(
    "visibilitychange",
    async () => {

        if (
            document.visibilityState ===
            "visible" &&
            currentUser
        ) {

            await refreshPremiumStatus();

        }

    }
);


/* =========================================================
   37. PREMIUM TOOL MENU
========================================================= */

function showPremiumToolsMenu() {

    currentPremiumTool =
        null;


    const menu =
        document.getElementById(
            "premiumToolsMenu"
        );


    if (menu) {

        menu.classList.remove(
            "hidden"
        );

    }


    document
        .querySelectorAll(
            ".premium-tool-panel"
        )
        .forEach(panel => {

            panel.classList.add(
                "hidden"
            );

        });


    applyLanguage();

}


/* =========================================================
   38. OPEN PREMIUM TOOL
========================================================= */

async function openPremiumCalculator(
    type
) {

    if (!currentUser) {

        showToast(
            t("loginFirst")
        );

        return;

    }


    const premium =
        await refreshPremiumStatus();


    if (!premium) {

        showToast(
            t("premiumOnly")
        );

        showPage(
            "premium"
        );

        return;

    }


    const panels = {

        enginePower:
            "enginePowerPanel",

        sfoc:
            "sfocPanel",

        shaftPower:
            "shaftPowerPanel",

        propellerSlip:
            "propellerSlipPanel",

        compressionRatio:
            "compressionRatioPanel",

        cylinderVolume:
            "cylinderVolumePanel",

        pumpCapacity:
            "pumpCapacityPanel",

        unitConverter:
            "unitConverterPanel"

    };


    const panelId =
        panels[type];


    if (!panelId) {

        return;

    }


    currentPremiumTool =
        type;


    document
        .getElementById(
            "premiumToolsMenu"
        )
        ?.classList
        .add(
            "hidden"
        );


    document
        .querySelectorAll(
            ".premium-tool-panel"
        )
        .forEach(panel => {

            panel.classList.add(
                "hidden"
            );

        });


    document
        .getElementById(
            panelId
        )
        ?.classList
        .remove(
            "hidden"
        );


    applyLanguage();


    window.scrollTo({

        top: 0,

        behavior:
            "smooth"

    });

}


/* =========================================================
   39. BACK TO PREMIUM MENU
========================================================= */

function backToPremiumTools() {

    showPremiumToolsMenu();

}


/* =========================================================
   40. ENGINE POWER CALCULATOR
========================================================= */

/*
    Formula:

    P(kW) =
    2 × PI × RPM × Torque
    ---------------------
       60 × 1000

    Equivalent:
    P(kW) = Torque × RPM / 9549.2966

    Torque = Nm
*/

async function calculateEnginePower() {

    const torque =
        Number(
            document
                .getElementById(
                    "engineTorque"
                )
                ?.value
        );


    const rpm =
        Number(
            document
                .getElementById(
                    "engineRPM"
                )
                ?.value
        );


    if (
        !Number.isFinite(torque) ||
        !Number.isFinite(rpm) ||
        torque <= 0 ||
        rpm <= 0
    ) {

        showToast(
            t("invalidValue")
        );

        return;

    }


    const powerKW =

        (
            2 *
            Math.PI *
            rpm *
            torque
        ) /
        (
            60 *
            1000
        );


    const powerHP =
        powerKW *
        1.34102209;


    const result =

        `${powerKW.toFixed(2)} kW | ${powerHP.toFixed(2)} HP`;


    setText(
        "enginePowerResult",
        result
    );


    await saveCalculation(

        "Engine Power",

        {

            torque_nm:
                torque,

            rpm:
                rpm

        },

        {

            power_kw:
                Number(
                    powerKW.toFixed(2)
                ),

            power_hp:
                Number(
                    powerHP.toFixed(2)
                )

        }

    );

}


/* =========================================================
   41. SFOC CALCULATOR
========================================================= */

/*
    SFOC =
    Fuel mass (g)
    ---------------------------
    Power (kW) × Time (hour)

    Input fuel = kg
    Output = g/kWh
*/

async function calculateSFOC() {

    const fuelMass =
        Number(
            document
                .getElementById(
                    "sfocFuelMass"
                )
                ?.value
        );


    const power =
        Number(
            document
                .getElementById(
                    "sfocPower"
                )
                ?.value
        );


    const time =
        Number(
            document
                .getElementById(
                    "sfocHours"
                )
                ?.value
        );


    if (
        !Number.isFinite(fuelMass) ||
        !Number.isFinite(power) ||
        !Number.isFinite(time) ||
        fuelMass <= 0 ||
        power <= 0 ||
        time <= 0
    ) {

        showToast(
            t("invalidValue")
        );

        return;

    }


    const sfoc =

        (
            fuelMass *
            1000
        ) /
        (
            power *
            time
        );


    setText(

        "sfocResult",

        `${sfoc.toFixed(2)} g/kWh`

    );


    await saveCalculation(

        "SFOC Calculator",

        {

            fuel_mass_kg:
                fuelMass,

            power_kw:
                power,

            operating_hours:
                time

        },

        {

            sfoc_g_kwh:
                Number(
                    sfoc.toFixed(2)
                )

        }

    );

}


/* =========================================================
   42. SHAFT POWER CALCULATOR
========================================================= */

async function calculateShaftPower() {

    const torque =
        Number(
            document
                .getElementById(
                    "shaftTorque"
                )
                ?.value
        );


    const rpm =
        Number(
            document
                .getElementById(
                    "shaftRPM"
                )
                ?.value
        );


    if (
        !Number.isFinite(torque) ||
        !Number.isFinite(rpm) ||
        torque <= 0 ||
        rpm <= 0
    ) {

        showToast(
            t("invalidValue")
        );

        return;

    }


    const powerKW =

        (
            2 *
            Math.PI *
            rpm *
            torque
        ) /
        (
            60 *
            1000
        );


    const powerHP =
        powerKW *
        1.34102209;


    setText(

        "shaftPowerResult",

        `${powerKW.toFixed(2)} kW | ${powerHP.toFixed(2)} HP`

    );


    await saveCalculation(

        "Shaft Power",

        {

            torque_nm:
                torque,

            rpm:
                rpm

        },

        {

            shaft_power_kw:
                Number(
                    powerKW.toFixed(2)
                ),

            shaft_power_hp:
                Number(
                    powerHP.toFixed(2)
                )

        }

    );

}


/* =========================================================
   43. PROPELLER SLIP CALCULATOR
========================================================= */

/*
    Pitch = meter / revolution

    Theoretical distance/hour:
    Pitch × RPM × 60

    knots =
    meters/hour / 1852

    Slip =
    (theoretical - actual)
    ----------------------
        theoretical
    × 100
*/

async function calculatePropellerSlip() {

    const pitch =
        Number(
            document
                .getElementById(
                    "propellerPitch"
                )
                ?.value
        );


    const rpm =
        Number(
            document
                .getElementById(
                    "propellerRPM"
                )
                ?.value
        );


    const actualSpeed =
        Number(
            document
                .getElementById(
                    "vesselSpeed"
                )
                ?.value
        );


    if (
        !Number.isFinite(pitch) ||
        !Number.isFinite(rpm) ||
        !Number.isFinite(actualSpeed) ||
        pitch <= 0 ||
        rpm <= 0 ||
        actualSpeed < 0
    ) {

        showToast(
            t("invalidValue")
        );

        return;

    }


    const theoreticalSpeed =

        (
            pitch *
            rpm *
            60
        ) /
        1852;


    const slip =

        (
            (
                theoreticalSpeed -
                actualSpeed
            ) /
            theoreticalSpeed
        ) *
        100;


    const result =

        `${slip.toFixed(2)} % | ${t("theoreticalSpeed")}: ${theoreticalSpeed.toFixed(2)} knot`;


    setText(
        "propellerSlipResult",
        result
    );


    await saveCalculation(

        "Propeller Slip",

        {

            pitch_meter:
                pitch,

            propeller_rpm:
                rpm,

            actual_speed_knots:
                actualSpeed

        },

        {

            theoretical_speed_knots:
                Number(
                    theoreticalSpeed.toFixed(2)
                ),

            slip_percent:
                Number(
                    slip.toFixed(2)
                )

        }

    );

}


/* =========================================================
   44. COMPRESSION RATIO
========================================================= */

/*
    CR =
    Swept Volume + Clearance Volume
    -------------------------------
          Clearance Volume
*/

async function calculateCompressionRatio() {

    const swept =
        Number(
            document
                .getElementById(
                    "sweptVolume"
                )
                ?.value
        );


    const clearance =
        Number(
            document
                .getElementById(
                    "clearanceVolume"
                )
                ?.value
        );


    if (
        !Number.isFinite(swept) ||
        !Number.isFinite(clearance) ||
        swept <= 0 ||
        clearance <= 0
    ) {

        showToast(
            t("invalidValue")
        );

        return;

    }


    const ratio =

        (
            swept +
            clearance
        ) /
        clearance;


    setText(

        "compressionRatioResult",

        `${ratio.toFixed(2)} : 1`

    );


    await saveCalculation(

        "Compression Ratio",

        {

            swept_volume:
                swept,

            clearance_volume:
                clearance

        },

        {

            compression_ratio:
                Number(
                    ratio.toFixed(2)
                )

        }

    );

}


/* =========================================================
   45. CYLINDER VOLUME
========================================================= */

/*
    Bore = mm
    Stroke = mm

    One cylinder volume:
    PI/4 × bore² × stroke

    mm³ → liter:
    divide by 1,000,000
*/

async function calculateCylinderVolume() {

    const bore =
        Number(
            document
                .getElementById(
                    "cylinderBore"
                )
                ?.value
        );


    const stroke =
        Number(
            document
                .getElementById(
                    "cylinderStroke"
                )
                ?.value
        );


    const cylinders =
        Number(
            document
                .getElementById(
                    "cylinderCount"
                )
                ?.value
        );


    if (
        !Number.isFinite(bore) ||
        !Number.isFinite(stroke) ||
        !Number.isFinite(cylinders) ||
        bore <= 0 ||
        stroke <= 0 ||
        cylinders <= 0
    ) {

        showToast(
            t("invalidValue")
        );

        return;

    }


    const oneCylinderMM3 =

        (
            Math.PI /
            4
        ) *
        Math.pow(
            bore,
            2
        ) *
        stroke;


    const oneCylinderLiter =
        oneCylinderMM3 /
        1000000;


    const totalLiter =
        oneCylinderLiter *
        cylinders;


    const totalM3 =
        totalLiter /
        1000;


    setText(

        "cylinderVolumeResult",

        `${totalLiter.toFixed(2)} L | ${totalM3.toFixed(4)} m³`

    );


    await saveCalculation(

        "Cylinder Volume",

        {

            bore_mm:
                bore,

            stroke_mm:
                stroke,

            cylinders:
                cylinders

        },

        {

            one_cylinder_liter:
                Number(
                    oneCylinderLiter.toFixed(2)
                ),

            total_liter:
                Number(
                    totalLiter.toFixed(2)
                ),

            total_m3:
                Number(
                    totalM3.toFixed(4)
                )

        }

    );

}


/* =========================================================
   46. PUMP CAPACITY
========================================================= */

/*
    Input:
    Volume = Liter
    Time = Minute

    Output:
    L/min
    L/hour
    m³/hour
*/

async function calculatePumpCapacity() {

    const volume =
        Number(
            document
                .getElementById(
                    "pumpVolume"
                )
                ?.value
        );


    const minutes =
        Number(
            document
                .getElementById(
                    "pumpMinutes"
                )
                ?.value
        );


    if (
        !Number.isFinite(volume) ||
        !Number.isFinite(minutes) ||
        volume <= 0 ||
        minutes <= 0
    ) {

        showToast(
            t("invalidValue")
        );

        return;

    }


    const litersPerMinute =
        volume /
        minutes;


    const litersPerHour =
        litersPerMinute *
        60;


    const cubicMeterPerHour =
        litersPerHour /
        1000;


    const result =

        `${litersPerMinute.toFixed(2)} L/min | ${cubicMeterPerHour.toFixed(3)} m³/h`;


    setText(
        "pumpCapacityResult",
        result
    );


    await saveCalculation(

        "Pump Capacity",

        {

            volume_liter:
                volume,

            time_minutes:
                minutes

        },

        {

            liters_per_minute:
                Number(
                    litersPerMinute.toFixed(2)
                ),

            liters_per_hour:
                Number(
                    litersPerHour.toFixed(2)
                ),

            cubic_meter_per_hour:
                Number(
                    cubicMeterPerHour.toFixed(3)
                )

        }

    );

}


/* =========================================================
   47. MARINE UNIT CONVERTER
========================================================= */

const unitDefinitions = {

    /* POWER */

    kw: {

        category:
            "power",

        toBase:
            value => value,

        fromBase:
            value => value

    },


    hp: {

        category:
            "power",

        toBase:
            value =>
                value *
                0.745699872,

        fromBase:
            value =>
                value /
                0.745699872

    },


    ps: {

        category:
            "power",

        toBase:
            value =>
                value *
                0.73549875,

        fromBase:
            value =>
                value /
                0.73549875

    },


    /* PRESSURE */

    bar: {

        category:
            "pressure",

        toBase:
            value => value,

        fromBase:
            value => value

    },


    psi: {

        category:
            "pressure",

        toBase:
            value =>
                value *
                0.0689475729,

        fromBase:
            value =>
                value /
                0.0689475729

    },


    kpa: {

        category:
            "pressure",

        toBase:
            value =>
                value /
                100,

        fromBase:
            value =>
                value *
                100

    },


    mpa: {

        category:
            "pressure",

        toBase:
            value =>
                value *
                10,

        fromBase:
            value =>
                value /
                10

    },


    /* VOLUME */

    liter: {

        category:
            "volume",

        toBase:
            value => value,

        fromBase:
            value => value

    },


    m3: {

        category:
            "volume",

        toBase:
            value =>
                value *
                1000,

        fromBase:
            value =>
                value /
                1000

    },


    gallon_us: {

        category:
            "volume",

        toBase:
            value =>
                value *
                3.785411784,

        fromBase:
            value =>
                value /
                3.785411784

    },


    /* SPEED */

    knot: {

        category:
            "speed",

        toBase:
            value => value,

        fromBase:
            value => value

    },


    kmh: {

        category:
            "speed",

        toBase:
            value =>
                value /
                1.852,

        fromBase:
            value =>
                value *
                1.852

    },


    ms: {

        category:
            "speed",

        toBase:
            value =>
                value *
                1.94384449,

        fromBase:
            value =>
                value /
                1.94384449

    }

};


/* =========================================================
   48. CONVERT MARINE UNIT
========================================================= */

async function convertMarineUnit() {

    const value =
        Number(
            document
                .getElementById(
                    "converterValue"
                )
                ?.value
        );


    const fromUnit =
        document
            .getElementById(
                "converterFrom"
            )
            ?.value;


    const toUnit =
        document
            .getElementById(
                "converterTo"
            )
            ?.value;


    if (
        !Number.isFinite(value) ||
        !fromUnit ||
        !toUnit
    ) {

        showToast(
            t("invalidValue")
        );

        return;

    }


    const fromDefinition =
        unitDefinitions[
            fromUnit
        ];


    const toDefinition =
        unitDefinitions[
            toUnit
        ];


    if (
        !fromDefinition ||
        !toDefinition
    ) {

        showToast(
            t("invalidValue")
        );

        return;

    }


    if (
        fromDefinition.category !==
        toDefinition.category
    ) {

        showToast(
            t("incompatibleUnits")
        );

        return;

    }


    const baseValue =
        fromDefinition
            .toBase(
                value
            );


    const converted =
        toDefinition
            .fromBase(
                baseValue
            );


    setText(

        "converterResult",

        `${converted.toFixed(4)} ${getUnitLabel(toUnit)}`

    );


    await saveCalculation(

        "Marine Unit Converter",

        {

            value:
                value,

            from:
                fromUnit,

            to:
                toUnit

        },

        {

            converted_value:
                Number(
                    converted.toFixed(4)
                )

        }

    );

}


/* =========================================================
   49. UNIT LABEL
========================================================= */

function getUnitLabel(unit) {

    const labels = {

        kw:
            "kW",

        hp:
            "HP",

        ps:
            "PS",

        bar:
            "bar",

        psi:
            "psi",

        kpa:
            "kPa",

        mpa:
            "MPa",

        liter:
            "L",

        m3:
            "m³",

        gallon_us:
            "US gal",

        knot:
            "knot",

        kmh:
            "km/h",

        ms:
            "m/s"

    };


    return (
        labels[unit] ||
        unit
    );

}


/* =========================================================
   END ENGINEX SCRIPT
========================================================= */
