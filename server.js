require('dotenv').config();

console.log("ENV check:", {
  DATABASE_URI: process.env.DATABASE_URI ? "set" : "missing",
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET ? "set" : "missing",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET ? "set" : "missing",
  PAY_STACK_KEY: process.env.PAY_STACK_KEY ? "set" : "missing"
});

const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require('express');
const verifyJWT = require('./middleware/verifyJWT');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOption = require('./config/corsOption');
const cookieParser = require('cookie-parser');
const hbs = require("hbs");

// Register custom helper
hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static('public'));

// Routers
app.use("/register", require("./router/register"));
app.use("/login", require("./router/auth"));
app.use("/logout", require("./router/logout"));
app.use("/refresh", require("./router/refresh"));
app.use("/payment", require("./router/payment"));
app.use("/medicines", verifyJWT, require("./router/medicine"));
app.use("/prescriptions", require("./router/pres"));
app.use("/", require("./router/dashboard"));

// Global error handler LAST
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message, err.stack);
  res.status(500).send("Internal Server Error");
});

const connectDB = require('./config/db');

// ✅ Wrap DB connect in async IIFE so errors are caught
(async () => {
  try {
    await connectDB();
    console.log("MongoDB connection established");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
})();

// ✅ Export app for Vercel, listen only locally
if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
}

module.exports = app;