import mongoose from "mongoose";


// Define the schema for the Food collection
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
});

// Create a Mongoose model for the "food" collection
// If the model already exists, use it; otherwise, create a new model

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
