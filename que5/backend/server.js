import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import employeeRoutes from "./routes/employees.js";
import leaveRoutes from "./routes/leaves.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", employeeRoutes);
app.use("/api/leaves", leaveRoutes);

app.get("/", (req, res) => res.json({ status: "Employee API running" }));

app.listen(PORT, () => console.log(`✅ API running on http://localhost:${PORT}`));
