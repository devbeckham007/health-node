require('dotenv').config();
const dns = require("node:dns/promises");

// Force Node to use reliable DNS servers instead of Windows defaults
dns.setServers(["1.1.1.1", "8.8.8.8"]); // Cloudflare + Google



const express = require('express');
const verifyJWT = require('./middleware/verifyJWT')
const app = express();
const path = require('path');
const cors= require('cors');
const corsOption = require('./config/corsOption');
const cookieParser = require('cookie-parser')
const hbs = require("hbs");
const axios = require('axios');

// Register custom helper for role checks
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
app.use("/register", require("./router/register"));
app.use("/login", require("./router/auth"));
app.get("/", (req, res) => {
  res.render("dashboard"); // or redirect to /dashboard
});
app.use("/logout", require("./router/logout"));
app.use("/refresh", require("./router/refresh"));
app.use("/payment",require("./router/payment"));


app.use("/medicines", verifyJWT, require("./router/medicine"));
app.use("/prescriptions", require("./router/pres"));
const mongoose = require('mongoose');
const connectDB= require('./config/db');

connectDB();

mongoose.connection.once('open', ()=>{
    console.log('Connected to MongoDB');
})
app.listen( 5000, ()=>{
    console.log('Server is running on port 5000');
})
module.exports = app;