import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {}; // Ensure cartData is an object

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.user.id, { $set: { cartData } });
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Remove item from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;

      if (cartData[req.body.itemId] === 0) {
        delete cartData[req.body.itemId]; // Remove item completely
      }
    }

    await userModel.findByIdAndUpdate(req.user.id, { $set: { cartData } });
    res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get user cart
const getFCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export { addToCart, removeFromCart, getFCart };
