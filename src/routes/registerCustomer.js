import express from "express"
import registerCustomerController from "../controllers/registerCustomerController.js"

const router = express.Router();

router.route("/").post(registerCustomerController.registerCustomer);
router.route("/verifyEmail").post(registerCustomerController.verifyEmail);

export default router;