
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Public Folder
app.use(express.static(path.join(__dirname, "../public")));

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch(err => console.log("MongoDB Error:", err));

// Products API
app.get("/api/products", (req, res) => {
    res.json([
        { name: "Chocolate Cake", price: 650 },
        { name: "Cupcakes", price: 180 },
        { name: "Cookies", price: 120 },
        { name: "Croissants", price: 85 }
    ]);
});

// Order Schema
const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model("Contact", contactSchema);

// Orders API
app.post("/api/orders", async (req, res) => {
    try {
        const { customerName, email, items } = req.body;

        if (!customerName || !email ||
            !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Please provide valid order details."
            });
        }

        const order = new Order({
            customerName,
            email,
            items
        });

        await order.save();

        res.status(201).json({
            message: "Order saved successfully!",
            order
        });

    } catch (error) {
        console.error("Order Error:", error);

        res.status(500).json({
            message: "Error saving order."
        });
    }
});

// Contact API
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                message: "Please complete all fields."
            });
        }

        const contact = new Contact({
            name,
            email,
            message
        });

        await contact.save();

        res.status(201).json({
            message: "Message saved successfully!"
        });

    } catch (error) {
        console.error("Contact Error:", error);

        res.status(500).json({
            message: "Error saving message."
        });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
