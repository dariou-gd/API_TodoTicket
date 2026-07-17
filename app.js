import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors"

//Todos los import
import adminRoutes from "./src/routes/admins.js"
import ticketRoutes from "./src/routes/tickets.js"
import registerAdminRoutes from "./src/routes/registerAdmin.js"
import registerCustomerRoutes from "./src/routes/registerCustomer.js"
import loginAdminRoutes from "./src/routes/loginAdmin.js"
import loginCustomerRoutes from "./src/routes/loginCustomer.js"
import logoutRoutes from "./src/routes/logoutController.js"
import wompiRoutes from "./src/routes/wompi.js"

const app = express();

app.use(
    cors({
        origin: ["http:localhost:5173", "http://localhost:5174"],
        credentials: true,
    }),
);    

app.use(cookieParser());

app.use(express.json());

app.use("/api/admins", adminRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/registerAdmin", registerAdminRoutes);
app.use("/api/registerCustomer", registerCustomerRoutes);
app.use("/api/loginAdmin", loginAdminRoutes);
app.use("/api/loginCustomer", loginCustomerRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/wompi", wompiRoutes);

export default app;