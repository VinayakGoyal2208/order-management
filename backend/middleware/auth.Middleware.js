import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Ensure this matches the key in generateToken.js (id vs _id)
      req.user = {
        id: decoded.id,
        role: decoded.role
      };
      
      next();
    } catch (error) {
      return res.status(401).json({ msg: "Token expired or invalid" });
    }
  } else {
    return res.status(401).json({ msg: "Not authorized, no token" });
  }
};