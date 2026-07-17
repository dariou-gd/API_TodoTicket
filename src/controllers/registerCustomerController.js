import nodemailer from "nodemailer";
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bcryptjs from "bcryptjs"
import CustomerModel from "../models/customers.js"
import { config } from "../config.js";

const registerCustomerController = {};

registerCustomerController.registerCustomer = async (req, res) => {
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

        const existingCustomer = await CustomerModel.findOne({ email });
        if (existingCustomer) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const passwordHash = await bcryptjs.hash(password, 10);

        const newCustomer = new CustomerModel({
            name,
            lastName,
            email,
            password: passwordHash,
            isVerified,
            loginAttempts,
            timeOut,
        });

        await newCustomer.save();

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
            service: "gmail",
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
                return res
                    .status(500)
                    .json({ message: "Error sending verification email" });
            }
            res.status(200).json({ message: "Error sent: " + info.response })
        });
    } catch (error) {
        console.log("Error" + error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

registerCustomerController.verifyEmail = async(req, res) => {
    try {
        const {verificationCode} = req.body;
        const token = req.cookies.verificationTokenCookie
        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        const {email, verificationCode: storedCode} = decoded;

        if(verificationCode !== storedCode){
            return res.status(400).json({message: "Invalid code"});
        }

        const customer = await CustomerModel.findOne({email});
        customer.isVerified = true;
        await customer.save();

        res.clearCookie("verificationTokenCookie");

        res.json({message: "Email verified succesfully"});
    } catch (error) {
        console.error("Error" + error);
        return res.status(500).json({message: "Internal server error"});
    }
};

export default registerCustomerController;