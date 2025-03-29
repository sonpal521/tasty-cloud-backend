import express from "express";
import {
  addToCart,
  removeFromCart,
  getFCart,
} from "../controllers/cartControler.js"; 
import authMiddleware from "../middleware/auth.js"; 

// Create a new Express router for cart-related routes
const cartRouter = express.Router();

// Route to add an item to the cart
// Uses authentication middleware to ensure only logged-in users can access it
cartRouter.post("/add", authMiddleware, addToCart);

// Route to remove an item from the cart
// Protected by authentication middleware
cartRouter.post("/remove", authMiddleware, removeFromCart);

// Route to get the user's cart items
// Also protected to ensure only authorized users can retrieve their cart data
cartRouter.post("/get", authMiddleware, getFCart);

export default cartRouter;
