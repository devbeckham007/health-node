const user = require('../model/user');
const User = require('../model/user');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    try{
        const cookies =req.cookies;
        if(!cookies?.jwt) return res.status(401).json({message: "Unauthorized"});
        const refreshToken = cookies.jwt;
        const foundUser = await User.findOne({refreshToken}).exec();
        if(!foundUser) return res.status(403).json({message: "Forbidden"});

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
          (err, decoded) => {
            if(err || foundUser._id.toString() !== decoded.id) return res.sendStatus(403);

      const accessToken = jwt.sign(
        { id: decoded.id, role: decoded.role, username: decoded.username, email: decoded.email },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: "15m"}
            );
            res.json({ accessToken });
    });
    }catch (error) {
        console.error("Error handling refresh token:", error);
        return res.status(500).json({message: "Server error"});
    }
};

module.exports = {handleRefreshToken};