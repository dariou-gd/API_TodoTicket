import nodemailer from "nodemailer";
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import adminModel from "../models/admins.js"
import { config } from "../config.js";

const registerAdminController = {};

registerAdminController.registerAdmin = async (req, res) => {
    try {
        let {
            name,
            lastName,
            email,
            password,
            isVerified,
            loginAttempts,
            timeOut,
        } = req.body;

        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const passwordHash = await bcryptjs.hash(password, 10);

        const newAdmin = new adminModel({
            name,
            lastName,
            email,
            password: passwordHash,
            isVerified,
            loginAttempts,
            timeOut,
        });

        await newAdmin.save();

        const verificationCode = crypto.randomBytes(3).toString("hex");

        const tokenCode = jsonwebtoken.sign(
            { email, verificationCode },
            config.JWT.secret,
            { expiresIn: "15m" },
        );

        res.cookie("verificationTokenCookie", tokenCode, {
            maxAge: 15 * 60 * 1000,
        });

        const transporter = nodemailer.createTransport({
            sservice: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password,
            }
        });

        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Verificación de cuenta",
            text:
                "Para verificar tu cuenta, utiliza este código: " +
                verificationCode +
                "Expira en 15 minutos",
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error sending email: " + error);
                return res.status(500)
                    .json({ message: "Error sending verification email" });
            }
            res.status(200).json({ message: "Error sent: " + info.response })
        });
    } catch (error) {
        console.log("Error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

registerAdminController.verifyEmail = async(req, res) => {
    try {
        const {verificationCode} = req.body;
        const token = req.cookie.verificationTokenCookie
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        const {email, verificationCode: storedCode} = decoded;

        if(verificationCode !== storedCode){
            return res.status(400).json({message: "Invalid code"});
        }

        const admin = await adminModel.findOne({email});
        admin.isVerified = true;
        await admin.save();

        res.clearCookie("verificationTokenCookie");

        res.json({message: "Email verified succesfully"});
    } catch (error) {
        console.error("Error" + error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export default registerAdminController;