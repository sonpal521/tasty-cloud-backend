import express from "express"; 
import { addFood, listFood, removeFood } from "../controllers/foodControler.js"; 
import multer from "multer"; 


// Create a new Express food router
const foodRouter = express.Router(); 

//  Image Storage Engine (Multer Configuration)
const storage = multer.diskStorage({
  destination: "uploads", // Specifies where uploaded images will be stored
  filename: (req, file, cb) => {
    // Generates a unique filename using the current timestamp + original file name
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }); // Initialize multer with the configured storage engine

//  Routes

// Route to add a new food item
// Uses Multer to handle single file upload (image field name must be "image")
foodRouter.post("/add", upload.single("image"), addFood);

// Route to list all food items
foodRouter.get("/list", listFood);

// Route to remove a food item
foodRouter.post("/remove", removeFood);

export default foodRouter; 
