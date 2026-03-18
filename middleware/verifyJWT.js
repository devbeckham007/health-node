const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    console.log("No accessToken cookie found");
    return res.redirect("/login");
    // return res.status(401).json({ message: "Unauthorized - no token" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.status(403).json({ message: "Forbidden - invalid token" });
    }

    console.log("✅ Token verified successfully:", decoded);
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,   
      email: decoded.email
    };
    next();
  });
};

module.exports = verifyJWT;