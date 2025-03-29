import express from "express"; 
import { loginUser, registerUser } from "../controllers/userControler.js"; 

const userRouter = express.Router(); // Create a new Express router

//  User Authentication Routes

// Route for user registration
// This allows new users to create an account
userRouter.post("/register", registerUser);

// Route for user login
// This verifies user credentials and provides a JWT token upon successful login
userRouter.post("/login", loginUser);

export default userRouter; 
