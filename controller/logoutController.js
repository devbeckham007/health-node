const User = require('../model/user');
const jwt = require('jsonwebtoken');

const logoutUser = async (req, res) => {
    try{
        const cookies = req.cookies;
        if(!cookies?.jwt) return res.redirect("/login");
        const refreshToken = cookies.jwt;

        const foundUser = await User.findOne({refreshToken}).exec();
        if(foundUser){
           foundUser.refreshToken = "";
           await foundUser.save();
        };
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: "strict",
        });
        return res.redirect("/login");

    }catch (error) {
        console.error("Error logging out user:", error);
        return res.render("dashboard", { error: "Server error" });
    }
};

module.exports = {logoutUser};