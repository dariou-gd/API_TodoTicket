import jsonwebtoken from "jsonwebtoken"
import { config } from "../config.js"

export const validateAuthCookie = (allowedTypes = []) => {
    return (req, res, next) => {
        try {
            const { authCookie } = req.cookies;

            if(!authCookie){
                return res.status(403)
                .json({message: "No cookie found, Authorization required"});
            }

            const decoded = jsonwebtoken.verify(authCookie, config.JWT.secret);

            if(!allowedTypes.includes(decoded.userType)) {
                return res.status(404).json({message: "Access denied"});
            }
            next();
        } catch(error) {
            console.log("Error" + error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}