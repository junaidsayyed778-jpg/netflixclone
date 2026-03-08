const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklistModel");

async function authMiddleware(req, res, next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    const isTokenBlacklisted = await blacklistModel.findOne({ token });
    if(isTokenBlacklisted){
        return res.status(401).json({
            message: "Token is invalid"
        })
    }
    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    }catch(error){
        return res.status(401).json({
            message: "Token is Invalid"
        })
    }
    
}

module.exports = authMiddleware;