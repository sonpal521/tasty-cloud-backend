import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import "dotenv/config";

// Function to generate a JWT token for authentication
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" }); // Token expires in 7 days
};

// User login function
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User doesn't exist" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = createToken(user._id);

    // Send a successful response with the token
    res.status(200).json({ success: true, token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// User registration function
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate email format using validator.js
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }

    // Check if the user already exists in the database
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password (at least 8 characters)",
      });
    }

    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Generate a JWT token for the newly registered user
    const token = createToken(savedUser._id);

    // Send a successful response with the token
    res.status(201).json({ success: true, token });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// Exporting the authentication functions
export { loginUser, registerUser };
