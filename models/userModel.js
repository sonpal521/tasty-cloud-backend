import mongoose from "mongoose";

// Define the schema for the User collection

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
  },
  { minimize: false }
);

// Create a Mongoose model for the "user" collection
// If the model already exists, use it; otherwise, create a new model

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
