import mongoose from "mongoose";

// Define the schema for the Order collection
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now() },
  payment: { type: Boolean, default: false },
});

// Create a Mongoose model for the "order" collection
// If the model already exists, use it; otherwise, create a new model

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
