import express from "express"
import ticketController from "../controllers/ticketController.js"
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/")
.get(validateAuthCookie(["admin"]), ticketController.getTicket)
.post(validateAuthCookie(["customer"]), ticketController.insertTicket)

router.route("/:id")
.put(validateAuthCookie(["customer", "admin"]), ticketController.updateTicket)
.delete(validateAuthCookie(["admin"]), ticketController.deleteTicket)

export default router;
