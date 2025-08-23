import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Employee from "../models/Employee.js";
dotenv.config();

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const emp = await Employee.findOne({ email });
    if (!emp) return res.status(400).json({ message: "Invalid credentials" });
    const ok = await bcrypt.compare(password, emp.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const payload = { id: emp._id, empid: emp.empid, email: emp.email, name: emp.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET || "devsecret", {
      expiresIn: process.env.JWT_EXPIRES_IN || "2d"
    });
    res.json({ token });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
