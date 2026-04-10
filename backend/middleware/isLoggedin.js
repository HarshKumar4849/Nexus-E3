const jwt = require("jsonwebtoken");
const userModel = require("../models/UserModel");

module.exports = async (req, res, next)=>{
    if(!req.cookies.token){
        return res.status(401).json({ error: "Authentication required" });
    }
    try{
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({ error: "Invalid token" });
        }
        let user = await userModel.findOne({email: decoded.email}).select("-password");
        req.user = user;
        next();
    }catch(err){
        console.log(err);
        return res.status(401).json({ error: "Token expired or invalid" });
    }
}