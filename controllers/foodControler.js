import foodModel from "../models/foodModel.js";
import fs from "fs";

// Add a new food item
const addFood = async (req, res) => {
  try {
    // Check if all required fields are present
    if (!req.body.name || !req.body.description || !req.body.price || !req.body.category) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Set image filename; if no file is uploaded, use a default image
    let image_filename = req.file ? req.file.filename : "default.jpg";

    // Create a new food item with provided data
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
    });

    // Save the food item to the database
    await food.save();
    res.status(201).json({ success: true, message: "Food Added" });
  } catch (error) {
    console.error("Error adding food:", error.message);
    res.status(500).json({ success: false, message: "Error occurred while adding food" });
  }
};

// Get a list of all food items
const listFood = async (req, res) => {
  try {
    // Retrieve all food items from the database
    const foods = await foodModel.find({});
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.error("Error fetching food list:", error.message);
    res.status(500).json({ success: false, message: "Error retrieving food items" });
  }
};

// Remove a food item by ID
const removeFood = async (req, res) => {
  try {
    // Find the food item by its ID
    const food = await foodModel.findById(req.body.id);
    
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found" });
    }

    // Remove the image file associated with the food item
    fs.unlink(`uploads/${food.image}`, (err) => {
      if (err) {
        console.error("Error deleting image file:", err.message);
      }
    });

    // Delete the food item from the database
    await foodModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.error("Error removing food:", error.message);
    res.status(500).json({ success: false, message: "Error occurred while removing food" });
  }
};

export { addFood, listFood, removeFood };
