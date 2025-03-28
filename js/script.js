document.addEventListener("DOMContentLoaded", function() {
    let carousel = new bootstrap.Carousel(document.querySelector("#carouselExample"), {
        interval: 3000,
        wrap: true
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const cartItems = [];
    let totalPrice = 0;

    function updateCart() {
        const cartItemsDiv = document.getElementById('cartItems');
        cartItemsDiv.innerHTML = "";

        cartItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `<span>${item.product} - Rs.${item.price}</span> 
            <button class="remove-from-cart" data-index="${index}">Remove</button>`;
            cartItemsDiv.appendChild(itemDiv);
        });

        document.getElementById('totalprice').textContent = totalPrice;

        // Enable or disable the "Place Order" button
        document.getElementById('placeOrder').disabled = cartItems.length === 0;

        // Attach event listeners to "Remove" buttons
        document.querySelectorAll(".remove-from-cart").forEach(button => {
            button.addEventListener("click", function () {
                const index = parseInt(this.dataset.index);
                removeFromCart(index);
            });
        });
    }

    function addToCart(product, price) {
        cartItems.push({ product, price });
        totalPrice += price;
        updateCart();
    }

    function removeFromCart(index) {
        if (index !== -1) {
            totalPrice -= cartItems[index].price;
            cartItems.splice(index, 1);
            updateCart();
        }
    }

    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const product = this.dataset.product;
            const price = parseFloat(this.dataset.price);
            addToCart(product, price);
        });
    });

    // Handle "Place Order" button
    document.getElementById("placeOrder").addEventListener("click", function () {
        if (cartItems.length > 0) {
            alert("Order placed successfully!");
            cartItems.length = 0; // Clear cart after placing order
            totalPrice = 0;
            updateCart();

            // Redirect to home (index.html) after 1.5 seconds
            setTimeout(() => {
                window.location.href = "/index.html";
            }, 1500);
        }
    });

});
