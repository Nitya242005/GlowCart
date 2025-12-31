document.addEventListener("DOMContentLoaded", function () {

    /* =======================
       TOAST NOTIFICATION
    ======================== */
    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.innerText = message;

        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.right = "20px";
        toast.style.padding = "12px 18px";
        toast.style.background = type === "error" ? "#dc3545" : "#198754";
        toast.style.color = "#fff";
        toast.style.borderRadius = "6px";
        toast.style.zIndex = "9999";
        toast.style.fontSize = "14px";
        toast.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
    }

    /* =======================
       EMAIL VALIDATION
    ======================== */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    /* =======================
       BOOTSTRAP CAROUSEL
    ======================== */
    const carouselElement = document.querySelector("#carouselExample");
    if (carouselElement && typeof bootstrap !== "undefined") {
        new bootstrap.Carousel(carouselElement, {
            interval: 3000,
            wrap: true
        });
    }

    /* =======================
       CART WITH QUANTITY
    ======================== */
    const cartItems = [];

    function updateCart() {
        const cartItemsDiv = document.getElementById("cartItems");
        const totalPriceEl = document.getElementById("totalprice");
        const placeOrderBtn = document.getElementById("placeOrder");

        if (!cartItemsDiv || !totalPriceEl || !placeOrderBtn) return;

        cartItemsDiv.innerHTML = "";
        let total = 0;

        cartItems.forEach((item, index) => {
            total += item.price * item.quantity;

            const div = document.createElement("div");
            div.className = "cart-item";
            div.innerHTML = `
                <span>${item.product} - Rs.${item.price} × ${item.quantity}</span>
                <button class="qty-btn" data-action="decrease" data-index="${index}">➖</button>
                <button class="qty-btn" data-action="increase" data-index="${index}">➕</button>
                <button class="remove-from-cart" data-index="${index}">Remove</button>
            `;
            cartItemsDiv.appendChild(div);
        });

        totalPriceEl.textContent = total;
        placeOrderBtn.disabled = cartItems.length === 0;
        attachCartEvents();
    }

    function addToCart(product, price) {
        const item = cartItems.find(i => i.product === product);
        if (item) item.quantity++;
        else cartItems.push({ product, price, quantity: 1 });

        showToast("Added to cart");
        updateCart();
    }

    function attachCartEvents() {
        document.querySelectorAll(".qty-btn").forEach(btn => {
            btn.onclick = function () {
                const i = +this.dataset.index;
                if (this.dataset.action === "increase") {
                    cartItems[i].quantity++;
                } else {
                    cartItems[i].quantity--;
                    if (cartItems[i].quantity === 0) cartItems.splice(i, 1);
                }
                updateCart();
            };
        });

        document.querySelectorAll(".remove-from-cart").forEach(btn => {
            btn.onclick = () => {
                cartItems.splice(+btn.dataset.index, 1);
                updateCart();
            };
        });
    }

    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.onclick = () =>
            addToCart(btn.dataset.product, parseFloat(btn.dataset.price));
    });

    const placeOrderBtn = document.getElementById("placeOrder");
    if (placeOrderBtn) {
        placeOrderBtn.onclick = () => {
            if (!cartItems.length) return;
            showToast("Order placed successfully");
            cartItems.length = 0;
            updateCart();
            setTimeout(() => location.href = "index.html", 1500);
        };
    }

    /* =======================
       SEARCH REDIRECT
    ======================== */
    const searchForm = document.querySelector(".d-flex");
    const searchInput = document.querySelector(".search-input");

    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const v = searchInput.value.toLowerCase();

            if (!v) return showToast("Enter a search term", "error");
            if (v.includes("skin")) location.href = "categories/skincare.html";
            else if (v.includes("hair")) location.href = "categories/haircare.html";
            else if (v.includes("nail")) location.href = "categories/nailcare.html";
            else showToast("No matching category", "error");
        });
    }

    /* =======================
       LOGIN FUNCTIONALITY
    ======================== */
    const loginBtn = document.getElementById("loginBtn");
    const loginForm = document.getElementById("loginForm");
    const closeLoginForm = document.getElementById("closeLoginForm");
    const submitBtn = document.getElementById("submitBtn");

    if (loginBtn && submitBtn) {
        loginBtn.onclick = () => loginForm.style.display = "block";
        if (closeLoginForm) closeLoginForm.onclick = () => loginForm.style.display = "none";

        submitBtn.onclick = () => {
            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !email || !password)
                return showToast("Fill all login fields", "error");

            if (!isValidEmail(email))
                return showToast("Invalid email format", "error");

            if (password.length < 6)
                return showToast("Password must be 6+ chars", "error");

            localStorage.setItem("loggedInUser", username);
            loginBtn.innerText = "Welcome, " + username;
            loginBtn.disabled = true;
            loginForm.style.display = "none";
            showToast("Login successful");
        };

        const saved = localStorage.getItem("loggedInUser");
        if (saved) {
            loginBtn.innerText = "Welcome, " + saved;
            loginBtn.disabled = true;
        }
    }

    /* =======================
       CONTACT FORM
    ======================== */
    const contactForm = document.getElementById("contactForm");
    const contactName = document.getElementById("contactName");
    const contactEmail = document.getElementById("contactEmail");
    const contactMessage = document.getElementById("contactMessage");

    if (contactMessage) {
        contactMessage.addEventListener("input", function () {
            if (this.value.length > 200) {
                this.value = this.value.slice(0, 200);
                showToast("Max 200 characters", "error");
            }
        });
    }

    if (contactForm) {
        contactForm.onsubmit = e => {
            e.preventDefault();

            if (!contactName.value || !contactEmail.value || !contactMessage.value)
                return showToast("Fill all contact fields", "error");

            if (!isValidEmail(contactEmail.value))
                return showToast("Invalid email", "error");

            showToast("Message sent successfully");
            contactForm.reset();
        };
    }

    /* =======================
       SHAKE INPUT
    ======================== */
    function shakeInput(input) {
        input.classList.add("shake");
        setTimeout(() => input.classList.remove("shake"), 300);
    }

   /* =======================
   SCROLL ANIMATIONS
======================= */
const scrollItems = document.querySelectorAll(".scroll-effect");
const footer = document.querySelector("footer");

function revealOnScroll() {
    const triggerPoint = window.innerHeight - 50;

    
    scrollItems.forEach(el => {
        if (el.getBoundingClientRect().top < triggerPoint) {
            el.classList.add("visible");
        }
    });

    
    if (footer && footer.getBoundingClientRect().top < triggerPoint) {
        footer.classList.add("visible");
    }
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); 

    /* =======================
       DARK MODE TOGGLE
    ======================== */
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.style.background = "#121212";
        document.body.style.color = "#fff";
    }

    if (themeToggle) {
        themeToggle.onclick = () => {
            const dark = document.body.style.background !== "";
            document.body.style.background = dark ? "" : "#121212";
            document.body.style.color = dark ? "" : "#fff";
            localStorage.setItem("theme", dark ? "light" : "dark");
            showToast(dark ? "Light mode" : "Dark mode");
        };
    }

});
    