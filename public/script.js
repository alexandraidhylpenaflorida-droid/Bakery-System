
const products = [
    {
        id: 1,
        name: "Chocolate Cake",
        price: 650,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600"
    },
    {
        id: 2,
        name: "Cupcakes",
        price: 180,
        image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600"
    },
    {
        id: 3,
        name: "Cookies",
        price: 120,
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600"
    },
    {
        id: 4,
        name: "Croissants",
        price: 85,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600"
    }
];

let cart = [];

function displayProducts() {
    const list = document.getElementById("product-list");

    list.innerHTML = products.map(product => `
        <div class="product">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₱${product.price}</p>
            <button class="btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join("");
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(p => p.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }

    displayCart();
}

function displayCart() {
    const items = document.getElementById("cart-items");

    items.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>₱${item.price * item.quantity}</span>
            <button onclick="removeItem(${item.id})">Remove</button>
        </div>
    `).join("");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.getElementById("total").textContent = total;
    document.getElementById("cart-count").textContent =
        cart.reduce((sum, item) => sum + item.quantity, 0);
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    displayCart();
}

async function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const name = prompt("Enter your name:");
    if (!name || !name.trim()) return;

    const email = prompt("Enter your email:");
    if (!email || !email.includes("@")) {
        alert("Please enter a valid email.");
        return;
    }

    const order = {
        customerName: name,
        email: email,
        items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
        }))
    };

    try {
        const response = await fetch("/api/orders", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(order)
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.message);

        alert("Order submitted successfully!");
        cart = [];
        displayCart();
    } catch (error) {
        alert(error.message || "Unable to submit order.");
    }
}

document.getElementById("contact-form")
.addEventListener("submit", async function(event) {
    event.preventDefault();

    const data = {
        name: document.getElementById("contact-name").value,
        email: document.getElementById("contact-email").value,
        message: document.getElementById("contact-message").value
    };

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.message);

        document.getElementById("contact-status").textContent =
            "Message sent successfully!";
        this.reset();
    } catch (error) {
        document.getElementById("contact-status").textContent =
            error.message || "Unable to send message.";
    }
});

displayProducts();
displayCart();
