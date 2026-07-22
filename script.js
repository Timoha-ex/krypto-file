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

// Клікабельні картки програми з коротким поясненням
(() => {
    const cards = document.querySelectorAll(".hp-crypto__cards .hp-crypto__card");
    if (!cards.length) return;

    const cardInfo = [
        {
            title: "Smart Money",
            text: "Smart Money — це підхід до аналізу ринку через дії великих учасників: банків, фондів і маркетмейкерів. Ти навчишся бачити, де вони збирають ліквідність і звідки може початися сильний рух ціни."
        },
        {
            title: "Аналіз ліквідності",
            text: "Ліквідність — це зони, де накопичено багато ордерів і стоп-лосів. Їхній пошук допомагає розуміти, куди ціна може піти перед справжнім рухом і де ринок найчастіше робить маніпуляції."
        },
        {
            title: "Пошук точок входу",
            text: "Точка входу формується не за емоціями, а після підтвердження структури ринку. Ти отримаєш чіткий алгоритм входу з логічним стоп-лосом і зрозумілою ціллю."
        },
        {
            title: "Управління капіталом",
            text: "Ризик-менеджмент визначає, якою частиною депозиту можна ризикувати в одній угоді. Головна мета — захистити капітал, уникати великих просадок і залишатися стабільним на дистанції."
        }
    ];

    const style = document.createElement("style");
    style.textContent = `
        .hp-crypto__cards .hp-crypto__card {
            cursor: pointer;
            position: relative;
            transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
        }
        .hp-crypto__cards .hp-crypto__card:hover,
        .hp-crypto__cards .hp-crypto__card:focus-visible {
            transform: translateY(-5px);
            border-color: rgba(0, 255, 102, .75);
            box-shadow: 0 14px 38px rgba(0, 220, 90, .15);
            outline: none;
        }
        .hp-crypto__cards .hp-crypto__card::after {
            content: "Натисни, щоб дізнатися більше";
            display: block;
            margin-top: 14px;
            color: #00d95f;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: .03em;
            opacity: .8;
        }
        .program-info-modal {
            position: fixed;
            inset: 0;
            z-index: 10050;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: rgba(0, 0, 0, .78);
            backdrop-filter: blur(8px);
            opacity: 0;
            visibility: hidden;
            transition: opacity .22s ease, visibility .22s ease;
        }
        .program-info-modal.active {
            opacity: 1;
            visibility: visible;
        }
        .program-info-modal__window {
            width: min(520px, 100%);
            position: relative;
            padding: 34px 28px 30px;
            border: 1px solid rgba(0, 230, 95, .5);
            border-radius: 20px;
            background: linear-gradient(145deg, #08120c, #040806);
            box-shadow: 0 0 60px rgba(0, 220, 90, .18);
            transform: translateY(18px) scale(.97);
            transition: transform .22s ease;
        }
        .program-info-modal.active .program-info-modal__window {
            transform: translateY(0) scale(1);
        }
        .program-info-modal__close {
            position: absolute;
            top: 12px;
            right: 14px;
            width: 38px;
            height: 38px;
            border: 1px solid rgba(0, 230, 95, .35);
            border-radius: 50%;
            background: rgba(0, 0, 0, .35);
            color: #fff;
            font-size: 22px;
            line-height: 1;
            cursor: pointer;
        }
        .program-info-modal__label {
            margin: 0 0 8px;
            color: #00df65;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: .14em;
            text-transform: uppercase;
        }
        .program-info-modal__title {
            margin: 0 42px 16px 0;
            color: #fff;
            font-size: clamp(25px, 6vw, 36px);
            line-height: 1.12;
        }
        .program-info-modal__text {
            margin: 0;
            color: #b6c1ba;
            font-size: 17px;
            line-height: 1.65;
        }
        body.program-modal-open {
            overflow: hidden;
        }
        @media (max-width: 600px) {
            .program-info-modal__window {
                padding: 30px 22px 26px;
                border-radius: 16px;
            }
            .program-info-modal__text {
                font-size: 16px;
            }
            .hp-crypto__cards .hp-crypto__card::after {
                font-size: 11px;
            }
        }
    `;
    document.head.appendChild(style);

    const infoModal = document.createElement("div");
    infoModal.className = "program-info-modal";
    infoModal.setAttribute("aria-hidden", "true");
    infoModal.innerHTML = `
        <div class="program-info-modal__window" role="dialog" aria-modal="true" aria-labelledby="programInfoTitle">
            <button class="program-info-modal__close" type="button" aria-label="Закрити">×</button>
            <p class="program-info-modal__label">Що це таке?</p>
            <h3 class="program-info-modal__title" id="programInfoTitle"></h3>
            <p class="program-info-modal__text"></p>
        </div>
    `;
    document.body.appendChild(infoModal);

    const titleElement = infoModal.querySelector(".program-info-modal__title");
    const textElement = infoModal.querySelector(".program-info-modal__text");
    const closeButton = infoModal.querySelector(".program-info-modal__close");

    function openInfoModal(index) {
        const info = cardInfo[index];
        if (!info || !titleElement || !textElement) return;

        titleElement.textContent = info.title;
        textElement.textContent = info.text;
        infoModal.classList.add("active");
        infoModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("program-modal-open");
        closeButton?.focus();
    }

    function closeInfoModal() {
        infoModal.classList.remove("active");
        infoModal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("program-modal-open");
    }

    cards.forEach((card, index) => {
        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");
        card.setAttribute("aria-label", `Дізнатися більше: ${cardInfo[index]?.title || "тема програми"}`);

        card.addEventListener("click", () => openInfoModal(index));
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openInfoModal(index);
            }
        });
    });

    closeButton?.addEventListener("click", closeInfoModal);
    infoModal.addEventListener("click", (event) => {
        if (event.target === infoModal) closeInfoModal();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && infoModal.classList.contains("active")) {
            closeInfoModal();
        }
    });
})();