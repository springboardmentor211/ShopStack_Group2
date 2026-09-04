const product = {
    name: "Premium Wireless Headphones",
    price: 2999,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
};

let productQuantity = 1;

let cart = [];


/* Product Quantity */

function changeProductQuantity(change) {

    productQuantity += change;

    if (productQuantity < 1) {
        productQuantity = 1;
    }

    document.getElementById("product-quantity").innerText =
        productQuantity;
}


/* Add To Cart */

function addToCart() {

    const existingProduct =
        cart.find(item => item.name === product.name);


    if (existingProduct) {

        existingProduct.quantity += productQuantity;

    } else {

        cart.push({

            ...product,

            quantity: productQuantity

        });

    }


    productQuantity = 1;

    document.getElementById("product-quantity").innerText = 1;


    renderCart();
}


/* Render Cart */

function renderCart() {

    const cartItems =
        document.getElementById("cart-items");


    if (cart.length === 0) {

        cartItems.innerHTML =
            `<p class="empty-cart">Your cart is empty.</p>`;

        updateTotals();

        return;
    }


    cartItems.innerHTML = "";


    cart.forEach((item, index) => {

        cartItems.innerHTML += `

        <div class="cart-item">

            <div class="cart-product">

                <img src="${item.image}" alt="${item.name}">

                <div>

                    <h3>${item.name}</h3>

                    <p>₹${item.price}</p>

                </div>

            </div>


            <div class="cart-actions">

                <button onclick="updateQuantity(${index}, -1)">
                    −
                </button>

                <span>${item.quantity}</span>

                <button onclick="updateQuantity(${index}, 1)">
                    +
                </button>


                <button
                    class="remove-btn"
                    onclick="removeFromCart(${index})"
                >
                    Remove
                </button>

            </div>

        </div>

        `;

    });


    updateTotals();
}


/* Update Quantity */

function updateQuantity(index, change) {

    cart[index].quantity += change;


    if (cart[index].quantity < 1) {

        cart[index].quantity = 1;

    }


    renderCart();
}


/* Remove Product */

function removeFromCart(index) {

    cart.splice(index, 1);

    renderCart();
}


/* Calculate Total */

function updateTotals() {

    let subtotal = 0;

    let itemCount = 0;


    cart.forEach(item => {

        subtotal += item.price * item.quantity;

        itemCount += item.quantity;

    });


    const shipping =
        subtotal > 0 ? 99 : 0;


    const total =
        subtotal + shipping;


    document.getElementById("subtotal").innerText =
        `₹${subtotal}`;


    document.getElementById("shipping").innerText =
        `₹${shipping}`;


    document.getElementById("total").innerText =
        `₹${total}`;


    document.getElementById("cart-count").innerText =
        itemCount;
}


/* Scroll to Cart */

function scrollToCart() {

    document
        .getElementById("cart")
        .scrollIntoView({

            behavior: "smooth"

        });
}


/* Checkout */

function checkout() {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }


    alert(
        "Proceeding to checkout!"
    );
}