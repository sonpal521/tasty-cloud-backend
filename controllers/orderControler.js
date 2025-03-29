import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import Stripe from "stripe";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to place an order
const placeOrder = async (req, res) => {
  try {
    // Extract JWT token from authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    // Verify and decode the token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; 

    // Validate user ID
    if (!userId) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // Validate required fields in the order request
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ success: false, message: "No items in the order" });
    }

    // Create a new order document
    const newOrder = new orderModel({
      userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    // Save the order in the database
    await newOrder.save();
    
    // Clear the user's cart after placing an order
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    console.log("Order saved successfully:", newOrder);

    // Prepare line items for Stripe checkout
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "gbp",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100), // Convert price to cents
      },
      quantity: item.quantity,
    }));

    // Add delivery charge as a separate item in Stripe checkout
    line_items.push({
      price_data: {
        currency: "gbp",
        product_data: { name: "Delivery Charges" },
        unit_amount: 200, // Fixed delivery charge
      },
      quantity: 1,
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    console.log("Stripe session created:", session.url);
    
    // Return the Stripe checkout session URL to the frontend
    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message,
    });
  }
};


// Function to verify an order payment status
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      //  Update the order as paid and return updated order
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true }, // Set `status: "Paid"`
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      return res.json({ success: true, message: "Paid", order: updatedOrder });
    } else {
      //  Instead of deleting, mark order as failed
      const failedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { status: "Payment Failed" },
        { new: true }
      );

      if (!failedOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      return res.json({ success: false, message: "Not Paid", order: failedOrder });
    }
  } catch (error) {
    console.log("Order verification error:", error);
    return res.status(500).json({ success: false, message: "Error verifying order" });
  }
};


// Function to get all orders for a specific user
const userOrders = async (req, res) => {
  try {
    // Extract JWT token from authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }

    // Verify and decode the token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    console.log("Fetching orders for userId:", userId);

    // Validate user ID
    if (!userId) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // Retrieve all orders placed by the user
    const orders = await orderModel.find({ userId });

    console.log("Orders found:", orders);

    // Return user orders
    res.status(200).json({ success: true, data: orders });

  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// Function to list all orders (for admin panel)
const listOrders = async (req, res) => {
  try {
    console.log("Fetching all orders...");
    
    // Retrieve all orders from the database
    const orders = await orderModel.find({});
    
    // Return the list of all orders
    res.status(200).json({ success: true, data: orders });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Function to update order status
const updateStatus = async (req, res) => {
  try {
    // Update the order status based on the request body
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });

    res.status(200).json({ success: true, message: "Status Updated" });

  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Error updating order status" });
  }
};

// Exporting all order-related functions
export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
