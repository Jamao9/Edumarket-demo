document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("title");
    const passInput = document.getElementById("price");
    const nameInput = document.getElementById("description");
    const rememberCheck = document.getElementById("inp");
    const status = document.getElementById("status");

    // Oldin saqlangan ma’lumotlarni olish
    const savedEmail = localStorage.getItem("email");
    const savedPass = localStorage.getItem("password");
    const savedName = localStorage.getItem("username");
    const remember = localStorage.getItem("remember");
    const oneTimeLogin = sessionStorage.getItem("oneTimeLogin");

    // Agar "Saqlab qolish" bosilgan bo‘lsa → avtomatik inputlarni to‘ldiramiz
    if (remember === "true" && savedEmail && savedPass && savedName) {
        emailInput.value = savedEmail;
        passInput.value = savedPass;
        nameInput.value = savedName;
        rememberCheck.checked = true;
    }

    // Agar "saqlab qolish" belgilanmagan bo‘lsa, lekin oldin 1 marta kirgan bo‘lsa → qayta forma talab qilinsin
    if (remember !== "true" && oneTimeLogin === "done") {
        status.style.color = "red";
        status.innerText = "❌ Qaytadan ma’lumot kiriting!";
    }

    // Formani noValidate qilishni toggle
    const toggleNoValidate = () => {
        const remembered = localStorage.getItem("remember") === "true";
        form.noValidate = remembered || rememberCheck.checked;
    };
    toggleNoValidate();
    rememberCheck.addEventListener("change", toggleNoValidate);

    // Submit event
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passInput.value.trim();
        const username = nameInput.value.trim();

        if (!email || !password || !username) {
            status.style.color = "red";
            status.innerText = "❌ Ma’lumot to‘liq emas!";
            return;
        }

        // Agar saqlab qolish bosilgan bo‘lsa → localStorage’ga yozamiz
        if (rememberCheck.checked) {
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
            localStorage.setItem("username", username);
            localStorage.setItem("remember", "true");
        } else {
            // Faqat sessiya uchun kirish → sessionStorage’da belgilaymiz
            sessionStorage.setItem("oneTimeLogin", "done");
            localStorage.removeItem("remember"); 
        }

        status.style.color = "green";
        status.innerText = "✅ Xush kelibsiz, " + username;

        // 1s dan keyin boshqa sahifaga o‘tkazish
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    });
});
