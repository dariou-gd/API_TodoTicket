import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken"
import adminModel from "../models/admins.js"
import {config } from "../config.js"

const loginAdminController = {};

loginAdminController.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const userFound = await adminModel.findOne({email});

        if (!userFound){
            return res.status(404).json({message: "Admin not found"});
        }

        if (userFound.timeOut && userFound.found.timeOut > Date.now())
        {
            return res.status(403).json({message: "Cuenta bloqueada"});
        }

        const isMatch = await bcrypt.compare(password, userFound.password);

        if(!isMatch){
            userFound.loginAttempts = (userFound.loginAttempts || 0) + 1;
            if(userFound.loginAttempts >= 5) {
                userFound.timeOut = Date.now() + 15 * 60 *1000;
                userFound.loginAttempts = 0;

                await userFound.save();
                return res.status(403).json({message: "Cuenta bloqueada"});
            }

            await userFound.save();

            return res.status(403).json({message: "Contraseña incorrecta"});
        }

        userFound.loginAttempts = 0;
        userFound.timeOut = null;
        await userFound.save();

        const token = jsonwebtoken.sign(
            {id: userFound._id, userType: "admin"},
            config.JWT.secret,
            {expiresIn: "30d"},
        );

        res.cookie("authCookie", token);
        return res.status(200).json({message: "Login exitoso"});
    } catch (error) {
        console.error("Error" + error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export default loginAdminController;