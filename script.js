const countdownElement = document.getElementById("countdown");
const countdownDate = new Date("2026-07-30T23:59:59").getTime();

function updateCountdown() {
    if (!countdownElement) return;

    const distance = countdownDate - Date.now();

    if (distance <= 0) {
        countdownElement.textContent = "Акцію завершено";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElement.textContent = `${days}д ${hours}г ${minutes}хв ${seconds}с`;
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Мобільне меню та плавна прокрутка
(() => {
    const burger = document.getElementById("hpBurger");
    const mobileNav = document.getElementById("hpMobileNav");
    const closeBtn = document.getElementById("hpMobileClose");
    const mobileLinks = document.querySelectorAll(".hp-mnav-link");

    burger?.addEventListener("click", () => mobileNav?.classList.add("active"));
    closeBtn?.addEventListener("click", () => mobileNav?.classList.remove("active"));

    mobileLinks.forEach((link) => {
        link.addEventListener("click", () => mobileNav?.classList.remove("active"));
    });

    document.querySelectorAll('.hp-crypto a[href^="#"]').forEach((link) => {
        link.addEventListener("click", function (event) {
            const href = this.getAttribute("href");

            if (!href || href === "#" || href.includes("order")) return;

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: "smooth" });
        });
    });
})();

// Кастомний курсор лише для пристроїв із мишею
const cursor = document.getElementById("cursor");
let lastTrail = 0;

function createTrail(x, y) {
    const now = performance.now();
    if (now - lastTrail < 25) return;

    lastTrail = now;
    const trail = document.createElement("div");
    trail.className = "trail";
    trail.style.left = `${x}px`;
    trail.style.top = `${y}px`;
    document.body.appendChild(trail);

    setTimeout(() => trail.remove(), 500);
}

if (cursor && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", (event) => {
        cursor.style.left = `${event.clientX}px`;
        cursor.style.top = `${event.clientY}px`;
        createTrail(event.clientX, event.clientY);
    });

    document.querySelectorAll("button, a").forEach((item) => {
        item.addEventListener("mouseenter", () => {
            cursor.style.width = "60px";
            cursor.style.height = "60px";
        });

        item.addEventListener("mouseleave", () => {
            cursor.style.width = "28px";
            cursor.style.height = "28px";
        });
    });

    document.addEventListener("mousedown", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(.75)";
    });

    document.addEventListener("mouseup", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
    });
}

// Модальне вікно та форма заявки
const modal = document.getElementById("registerModal");
const closeModalButton = document.getElementById("closeModal");
const form = document.getElementById("registerForm");
const formContent = document.getElementById("formContent");
const successMessage = document.getElementById("successMessage");
const openButtons = document.querySelectorAll("#openModal, .openModal");

function openRegisterModal(event) {
    event?.preventDefault();
    modal?.classList.add("active");
}

function closeRegisterModal() {
    modal?.classList.remove("active");
}

openButtons.forEach((button) => button.addEventListener("click", openRegisterModal));
closeModalButton?.addEventListener("click", closeRegisterModal);

modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeRegisterModal();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeRegisterModal();
});

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd6Ks1Sm09cZwJd6BsEXn9Ca7avQWwnom9d8iN2B5sITO8dYQ/formResponse";

form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector(".submit-btn");
    const selectedContact = document.querySelector('input[name="contact"]:checked');

    if (!submitButton || !selectedContact) return;

    submitButton.disabled = true;
    submitButton.textContent = "Відправляємо...";

    const formData = new FormData();
    formData.append("entry.1507431541", document.getElementById("userName")?.value.trim() || "");
    formData.append("entry.526374724", document.getElementById("userPhone")?.value.trim() || "");
    formData.append("entry.1622305066", selectedContact.value);

    try {
        await fetch(GOOGLE_FORM_URL, {
            method: "POST",
            mode: "no-cors",
            body: formData
        });

        form.reset();
        if (formContent) formContent.style.display = "none";
        successMessage?.classList.add("active");

        setTimeout(() => {
            successMessage?.classList.remove("active");
            if (formContent) formContent.style.display = "block";
            closeRegisterModal();
        }, 3000);
    } catch (error) {
        alert("❌ Не вдалося відправити заявку. Спробуйте ще раз.");
        console.error(error);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Записатися";
    }
});
