const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render("login", { error: "Email and password are required" });
    }

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.render("login", { error: "Invalid email or password" });
    }

    const isTrue = await bcrypt.compare(password, foundUser.password);
    if (!isTrue) {
      return res.render("login", { error: "Invalid email or password" });
    }

    // Create tokens
    const refreshToken = jwt.sign(
      {id: foundUser._id, role: foundUser.role, username: foundUser.username, email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const accessToken = jwt.sign(
      { id: foundUser._id, username: foundUser.username, role: foundUser.role,email: foundUser.email  },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "3h" }
    );

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie("accessToken", accessToken, {
  httpOnly: true,
  secure: false, // set true if using HTTPS
  sameSite: "strict",
  maxAge: 15 * 60 * 1000 // 15 minutes
});

    // ✅ Only ONE response
    return res.redirect("/dashboard");
    // return res.render("login", { message: "Login successful!" });

  } catch (error) {
    console.error("Error logging in user:", error);
    return res.render("login", { error: "Server error" });
  }
};
module.exports = {  loginUser };