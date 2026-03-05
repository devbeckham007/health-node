const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require(' bcryptjs');

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
      return res.render("register", { error: "All fields are required" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashPassword, role });
    await newUser.save();
console.log("Saved user:", newUser);
    // Redirect to login page with success message
    res.render("login", { success: "User registered successfully, please log in." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.render("register", { error: "Server error" });
  }
};

module.exports = { registerUser};