const countdownDate = new Date("2026-06-22T23:59:59").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance < 0) {
        document.getElementById("countdown").innerHTML = "Акцію завершено";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML =
        days + "д " +
        hours + "г " +
        minutes + "хв " +
        seconds + "с";
}

updateCountdown();
setInterval(updateCountdown, 1000);

(function () {
    var burger = document.getElementById("hpBurger");
    var mobileNav = document.getElementById("hpMobileNav");
    var closeBtn = document.getElementById("hpMobileClose");
    var links = document.querySelectorAll(".hp-mnav-link");

    if (burger) {
        burger.addEventListener("click", function () {
            mobileNav.classList.add("active");
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            mobileNav.classList.remove("active");
        });
    }

    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function () {
            mobileNav.classList.remove("active");
        });
    }

    // Плавна прокрутка до секцій
    var allLinks = document.querySelectorAll('.hp-crypto a[href^="#"]');

    for (var j = 0; j < allLinks.length; j++) {
        allLinks[j].addEventListener("click", function (e) {
            var href = this.getAttribute("href");

            if (
                href &&
                href.charAt(0) === "#" &&
                href.length > 1 &&
                href.indexOf("order") === -1
            ) {
                var target = document.querySelector(href);

                if (target) {
                    e.preventDefault();

                    var offset = 80;
                    var top =
                        target.getBoundingClientRect().top +
                        window.pageYOffset -
                        offset;

                    window.scrollTo({
                        top: top,
                        behavior: "smooth"
                    });
                }
            }
        });
    }
})();




const cursor = document.getElementById("cursor");

let mouseX = 0;
let mouseY = 0;



document.addEventListener("mousemove",(e)=>{

    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    createTrail(e.clientX, e.clientY);

});


const hoverItems = document.querySelectorAll("button, a");

hoverItems.forEach(item=>{

    item.addEventListener("mouseenter",()=>{

        cursor.style.width="60px";
        cursor.style.height="60px";

    });

    item.addEventListener("mouseleave",()=>{

        cursor.style.width="28px";
        cursor.style.height="28px";

    });

});
document.addEventListener("mousedown",()=>{

    cursor.style.transform =
    "translate(-50%,-50%) scale(.75)";

});

document.addEventListener("mouseup",()=>{

    cursor.style.transform =
    "translate(-50%,-50%) scale(1)";

});

let lastTrail = 0;

function createTrail(x, y){

    const now = performance.now();

    if(now - lastTrail < 25) return;

    lastTrail = now;

    const trail = document.createElement("div");

    trail.className = "trail";

    trail.style.left = x + "px";
    trail.style.top = y + "px";

    document.body.appendChild(trail);

    setTimeout(()=>{

        trail.remove();

    },500);

}
// Заявка 

const openModal = document.getElementById("openModal");
const modal = document.getElementById("registerModal");
const closeModal = document.getElementById("closeModal");
const form = document.getElementById("registerForm");
const success = document.getElementById("successMessage");
// Відкрити форму
openModal.addEventListener("click", function(e){

    e.preventDefault();

    modal.classList.add("active");

});

// Закрити по хрестику
closeModal.addEventListener("click", function(){

    modal.classList.remove("active");

});

// Закрити при кліку по темному фону
modal.addEventListener("click", function(e){

    if(e.target === modal){

        modal.classList.remove("active");

    }

});

// Закрити клавішею Esc
document.addEventListener("keydown", function(e){

    if(e.key === "Escape"){

        modal.classList.remove("active");

    }

});
const openButtons = document.querySelectorAll(".openModal");

openButtons.forEach(button => {

    button.addEventListener("click", function(e){

        e.preventDefault();

        modal.classList.add("active");

    });

});
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwwmDXCCJZ-7LpWOYjNHC7TdcLdaCQzghxYC3xUexZoOf1dYtQvngXoj4OXGF1cvvba/exec";

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const submitBtn = form.querySelector(".submit-btn");

    submitBtn.disabled = true;
    submitBtn.textContent = "Відправляємо...";

    const data = {

        name: document.getElementById("userName").value,

        phone: document.getElementById("userPhone").value,

        contact: document.querySelector('input[name="contact"]:checked').value

    };

    try{

        const response = await fetch(SCRIPT_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(data)

        });

        if(!response.ok){

            throw new Error("Помилка сервера");

        }

        alert("✅ Заявку успішно відправлено!");

        form.reset();

        modal.classList.remove("active");

    }

    catch(error){

        alert("❌ Не вдалося відправити заявку.");

        console.error(error);

    }

    submitBtn.disabled=false;
    submitBtn.textContent="Записатися";

});
// Заявка 