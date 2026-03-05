const express = require('express');
const router = express.Router();
const { loginUser }  = require('../controller/authController');

router.get("/", (req, res) => {
    res.render("login");
});
router.post('/', loginUser);

module.exports = router;