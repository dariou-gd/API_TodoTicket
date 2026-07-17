import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors"

//Todos los import
import adminRoutes from "./src/routes/admins.js"
import registerAdminRoutes from "./src/routes/registerAdmin.js"
import loginAdminRoutes from "./src/routes/loginAdmin.js"
import logoutRoutes from "./src/routes/logoutController.js"

const app = express();

app.use(
    cors({
        origin: ["http:localhost:5173", "http://localhost:5174"],
        credentials: true,
    }),
);    

app.use(cookieParser());

app.use("/api/admins", adminRoutes);
app.use("/api/registerAdmin", registerAdminRoutes);
app.use("/api/loginAdmin", loginAdminRoutes);
app.use("/api/logout", logoutRoutes);

export default app;