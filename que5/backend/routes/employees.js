import express from "express";
import Employee from "../models/Employee.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// GET /api/me - profile of logged-in employee
router.get("/me", authRequired, async (req, res) => {
  const emp = await Employee.findById(req.user.id).select("-password").lean();
  if (!emp) return res.status(404).json({ message: "Employee not found" });
  res.json(emp);
});

export default router;
