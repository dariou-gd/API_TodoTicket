import express from "express"
import registerAdminController from "../controllers/registerAdminController.js"

const router = express.Router();

router.route("/").post(registerAdminController.registerAdmin);
router.route("/verifyEmail").post(registerAdminController.verifyEmail);

export default router;