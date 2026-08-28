const SUPABASE_URL = "https://xruphwixbafbfqtpjqor.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_BUYtrhS1y1Y2vGLdeVFSqw_IKGnu7i-";

const BACKEND_URL = "https://enginex-ls0ib1aeg-engine-x1.vercel.app/";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


let currentUser = null;
let currentProfile = null;


/* =========================
   INITIALIZATION
========================= */

document.addEventListener("DOMContentLoaded", async () => {

    await loadSession();

    if ("serviceWorker" in navigator) {
        try {
            await navigator.serviceWorker.register("sw.js");
        } catch (error) {
            console.log("Service worker:", error);
        }
    }

});


supabaseClient.auth.onAuthStateChange(
    async (event, session) => {

        currentUser = session?.user || null;

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
    } = await supabaseClient.auth.getSession();

    if (error) {
        console.error(error);
        return;
    }

    currentUser = data.session?.user || null;

    await updateUI();
}


/* =========================
   UI
========================= */

async function updateUI() {

    const loginButton =
        document.getElementById("loginButton");

    const logoutButton =
        document.getElementById("logoutButton");

    const dashboardNav =
        document.getElementById("dashboardNav");


    if (currentUser) {

        loginButton.classList.add("hidden");

        logoutButton.classList.remove("hidden");

        dashboardNav.classList.remove("hidden");

        await loadProfile();

    } else {

        loginButton.classList.remove("hidden");

        logoutButton.classList.add("hidden");

        dashboardNav.classList.add("hidden");

        currentProfile = null;

    }
}


/* =========================
   REGISTER
========================= */

async function register() {

    const name =
        document.getElementById("registerName")
            .value.trim();

    const email =
        document.getElementById("registerEmail")
            .value.trim();

    const password =
        document.getElementById("registerPassword")
            .value;


    if (!name || !email || !password) {

        showToast("Lengkapi semua data.");

        return;
    }


    if (password.length < 6) {

        showToast(
            "Password minimal 6 karakter."
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
                    full_name: name
                }

            }

        });


    if (error) {

        showToast(error.message);

        return;
    }


    closeAuth();


    if (data.session) {

        showToast(
            "Akun berhasil dibuat."
        );

    } else {

        showToast(
            "Akun dibuat. Periksa email untuk verifikasi."
        );

    }
}


/* =========================
   LOGIN
========================= */

async function login() {

    const email =
        document.getElementById("loginEmail")
            .value.trim();

    const password =
        document.getElementById("loginPassword")
            .value;


    if (!email || !password) {

        showToast("Masukkan email dan password.");

        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient.auth.signInWithPassword({

            email,

            password

        });


    if (error) {

        showToast(error.message);

        return;
    }


    currentUser = data.user;

    closeAuth();

    showPage("dashboard");

    showToast("Login berhasil.");

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

        showToast(error.message);

        return;
    }


    currentUser = null;

    currentProfile = null;

    showPage("home");

    showToast("Berhasil logout.");
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
            .eq("id", currentUser.id)
            .single();


    if (error) {

        console.error(error);

        return;
    }


    currentProfile = data;


    const email =
        document.getElementById("userEmail");

    const plan =
        document.getElementById("userPlan");

    const premiumUntil =
        document.getElementById("premiumUntil");


    if (email) {

        email.textContent =
            currentUser.email || "-";

    }


    if (plan) {

        plan.textContent =
            data.plan === "premium"
                ? "PREMIUM"
                : "FREE";

    }


    if (premiumUntil) {

        premiumUntil.textContent =
            data.premium_until
                ? formatDate(data.premium_until)
                : "-";

    }


    await loadHistory();
}


/* =========================
   HISTORY
========================= */

async function loadHistory() {

    const historyList =
        document.getElementById("historyList");


    if (!historyList || !currentUser) return;


    const {
        data,
        error
    } =
        await supabaseClient
            .from("calculations")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("created_at", {
                ascending: false
            })
            .limit(10);


    if (error) {

        historyList.innerHTML =
            `<p class="muted">
                Tidak dapat memuat riwayat.
            </p>`;

        return;
    }


    if (!data || data.length === 0) {

        historyList.innerHTML =
            `<p class="muted">
                Belum ada perhitungan.
            </p>`;

        return;
    }


    historyList.innerHTML =
        data.map(item => {

            return `
                <div class="dashboard-card"
                     style="margin-bottom:10px">

                    <strong>
                        ${escapeHTML(item.tool_name)}
                    </strong>

                    <span>
                        ${formatDate(item.created_at)}
                    </span>

                </div>
            `;

        }).join("");
}


/* =========================
   SAVE CALCULATION
========================= */

async function saveCalculation(
    toolName,
    inputData,
    resultData
) {

    if (!currentUser) return;


    const {
        error
    } =
        await supabaseClient
            .from("calculations")
            .insert({

                user_id: currentUser.id,

                tool_name: toolName,

                input_data: inputData,

                result_data: resultData

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
            document.getElementById(id);

        if (element) {

            element.classList.remove("active");

        }

    });


    const target =
        document.getElementById(page + "Page");


    if (target) {

        target.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    if (page === "dashboard") {

        if (!currentUser) {

            openAuth("login");

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
        document.getElementById("toolTitle");

    const description =
        document.getElementById("toolDescription");


    document
        .querySelectorAll(".calculator")
        .forEach(el =>
            el.classList.add("hidden")
        );


    if (type === "time") {

        title.textContent =
            "Time Calculator";

        description.textContent =
            "Calculate the duration between two times.";

        document
            .getElementById("timeCalculator")
            .classList.remove("hidden");

    }


    if (type === "fuel") {

        title.textContent =
            "Fuel Calculator";

        description.textContent =
            "Calculate average fuel consumption.";

        document
            .getElementById("fuelCalculator")
            .classList.remove("hidden");

    }


    if (type === "advanced") {

        title.textContent =
            "Advanced Engineering";

        description.textContent =
            "Premium engineering tools.";

        document
            .getElementById("advancedCalculator")
            .classList.remove("hidden");

    }
}


/* =========================
   TIME CALCULATOR
========================= */

async function calculateTime() {

    const start =
        document.getElementById("startTime").value;

    const end =
        document.getElementById("endTime").value;


    if (!start || !end) {

        showToast("Masukkan kedua waktu.");

        return;
    }


    const startDate =
        new Date(start);

    const endDate =
        new Date(end);


    const difference =
        endDate.getTime()
        -
        startDate.getTime();


    if (difference < 0) {

        showToast(
            "Waktu selesai harus setelah waktu mulai."
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
            (totalMinutes % 1440) / 60
        );


    const minutes =
        totalMinutes % 60;


    const result =
        `${days} hari ${hours} jam ${minutes} menit`;


    document
        .getElementById("timeResult")
        .textContent = result;


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
            document.getElementById("fuelLiter").value
        );

    const hours =
        Number(
            document.getElementById("fuelHours").value
        );


    if (
        !Number.isFinite(fuel) ||
        !Number.isFinite(hours) ||
        fuel <= 0 ||
        hours <= 0
    ) {

        showToast(
            "Masukkan nilai yang valid."
        );

        return;
    }


    const consumption =
        fuel / hours;


    const result =
        `${consumption.toFixed(2)} L/hour`;


    document
        .getElementById("fuelResult")
        .textContent = result;


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
        .getElementById("authModal")
        .classList.add("active");

    switchAuth(type);
}


function closeAuth() {

    document
        .getElementById("authModal")
        .classList.remove("active");
}


function switchAuth(type) {

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");


    if (type === "login") {

        loginForm.classList.remove("hidden");

        registerForm.classList.add("hidden");

    } else {

        loginForm.classList.add("hidden");

        registerForm.classList.remove("hidden");

    }
}


/* =========================
   PAYMENT
========================= */

async function startPayment(plan) {

    if (!currentUser) {

        showToast(
            "Login terlebih dahulu."
        );

        openAuth("login");

        return;
    }


    try {

        showToast(
            "Mempersiapkan pembayaran..."
        );


        const {
            data: sessionData
        } =
            await supabaseClient.auth.getSession();


        const session =
            sessionData.session;


        if (!session) {

            showToast(
                "Session login tidak ditemukan."
            );

            return;
        }


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

                    body: JSON.stringify({
                        plan
                    })

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Gagal membuat pembayaran."
            );

        }


        if (!result.token) {

            throw new Error(
                "Token pembayaran tidak tersedia."
            );

        }


        loadMidtransSnap(
            result.token
        );


    } catch (error) {

        console.error(error);

        showToast(error.message);

    }
}


/* =========================
   MIDTRANS SNAP
========================= */

function loadMidtransSnap(token) {

    if (
        typeof window.snap ===
        "undefined"
    ) {

        const script =
            document.createElement("script");

        script.src =
            "https://app.sandbox.midtrans.com/snap/snap.js";

        script.setAttribute(
            "data-client-key",
            "Mid-client-bW5KoXwW-iFCJobn"
        );


        script.onload = () => {

            window.snap.pay(
                token,

                {

                    onSuccess: () => {

                        showToast(
                            "Pembayaran berhasil. Premium sedang diproses."
                        );

                        setTimeout(
                            () => loadProfile(),
                            3000
                        );

                    },

                    onPending: () => {

                        showToast(
                            "Pembayaran masih menunggu."
                        );

                    },

                    onError: () => {

                        showToast(
                            "Pembayaran gagal."
                        );

                    },

                    onClose: () => {

                        showToast(
                            "Checkout ditutup."
                        );

                    }

                }

            );

        };


        document.body.appendChild(
            script
        );

    } else {

        window.snap.pay(
            token,

            {

                onSuccess: () => {

                    showToast(
                        "Pembayaran berhasil."
                    );

                    setTimeout(
                        () => loadProfile(),
                        3000
                    );

                },

                onPending: () => {

                    showToast(
                        "Pembayaran masih menunggu."
                    );

                },

                onError: () => {

                    showToast(
                        "Pembayaran gagal."
                    );

                }

            }

        );

    }
}


/* =========================
   LANGUAGE
========================= */

let english =
    false;


function toggleLanguage() {

    english = !english;


    const button =
        document.getElementById(
            "languageButton"
        );


    button.textContent =
        english
            ? "ID"
            : "EN";


    if (english) {

        showToast(
            "English mode is being prepared."
        );

    } else {

        showToast(
            "Mode Bahasa Indonesia."
        );

    }
}


/* =========================
   UTILITIES
========================= */

function formatDate(date) {

    return new Date(date)
        .toLocaleDateString(
            "id-ID",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
}


function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function showToast(message) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;

    toast.classList.add("show");


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);
}
