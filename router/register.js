const express = require('express');
const router = express.Router();
const { registerUser } = require('../controller/registerController');

// GET /register → show registration form
router.get('/', (req, res) => {
  res.render("register"); 
});

// POST /register → handle form submission
router.post('/', registerUser);

module.exports = router;