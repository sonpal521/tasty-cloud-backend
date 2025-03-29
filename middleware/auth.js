import jwt from "jsonwebtoken";

// Middleware function to authenticate users using JWT
const authMiddleware = async (req, res, next) => {
  // Retrieve the Authorization header
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is missing or doesn't start with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the JWT token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID from the decoded token to `req.user` for further use in routes
    req.user = { id: decoded.id };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    
    // Return a 403 Forbidden response if the token is invalid or expired
    return res.status(403).json({ success: false, message: "Invalid or Expired Token" });
  }
};

export default authMiddleware;
