import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
        success: false,
        message: "Authorization token missing" 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
        success: false, 
        message: "Invalid or expired token" 
    });
  }
};
