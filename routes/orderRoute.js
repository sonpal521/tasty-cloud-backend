import express from "express"; 
import authMiddleware from "../middleware/auth.js"; 
import {
  listOrders,
  placeOrder,
  updateStatus,
  userOrders,
  verifyOrder,
} from "../controllers/orderControler.js"; 

const orderRouter = express.Router();

//  Routes

// Place an order (User must be authenticated)
orderRouter.post("/place", authMiddleware, placeOrder);

// Verify order payment status (No authentication required, handled by Stripe)
orderRouter.post("/verify", verifyOrder);

// Fetch orders of a specific user (User must be authenticated)
orderRouter.post("/userorders", authMiddleware, userOrders);

// Fetch all orders (For admin panel - Add authentication if needed)
orderRouter.get("/list", listOrders);

// Update order status (Admin can update order status)
orderRouter.post("/status", updateStatus);

export default orderRouter;
