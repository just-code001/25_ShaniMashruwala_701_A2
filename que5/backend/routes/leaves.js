import express from "express";
import Leave from "../models/Leave.js";
import { authRequired } from "../middleware/auth.js";

const router = express.Router();

// List leaves of the logged-in employee
router.get("/", authRequired, async (req, res) => {
  const leaves = await Leave.find({ employee: req.user.id }).sort({ createdAt: -1 }).lean();
  res.json(leaves);
});

// Add a leave application
router.post("/", authRequired, async (req, res) => {
  try {
    const { date, reason, granted } = req.body;
    const leave = await Leave.create({
      employee: req.user.id,
      date,
      reason,
      granted: granted === true || granted === "true" // allow boolean or string
    });
    res.status(201).json(leave);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Invalid data" });
  }
});

export default router;
