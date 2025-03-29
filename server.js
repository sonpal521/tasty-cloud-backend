import express from "express"; 
import cors from "cors"; 
import { connectDB } from "./config/db.js"; 
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js"; 
import cartRouter from "./routes/cartRoute.js"; 
import orderRouter from "./routes/orderRoute.js"; 


//  Initialize Express App
const app = express();
const port = 5000; // Define the port number

//  Middleware
app.use(express.json()); // Enables parsing of JSON request bodies
app.use(cors()); // Enables CORS to allow frontend and backend communication
app.use(express.urlencoded({ extended: true })); // Parses form data (e.g., from HTML forms)


app.use(
  cors({
    origin:["https://tasty-cloud.netlify.app","https://tastycloudadmin.netlify.app"], // Allow only your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
   credentials: true,
  })
);


//  Connect to Database
connectDB(); 

//  API Endpoints

// Food-related routes (CRUD for food items)
app.use("/api/food", foodRouter);

// Serve images statically from 'uploads' folder
app.use("/images", express.static("uploads"));

// User authentication routes (Register/Login)
app.use("/api/user", userRouter);

// Cart management routes
app.use("/api/cart", cartRouter);

// Order processing routes (Checkout, Payment, Order tracking)
app.use("/api/order", orderRouter);

//  Root API Route
app.get("/", (req, res) => {
  res.send("API Working"); // Default route response
});

//  Start Server
app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`); // Log server startup message
});
