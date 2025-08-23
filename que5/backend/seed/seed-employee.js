import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Employee from "../models/Employee.js";

dotenv.config();

async function run() {
  await connectDB();
  const email = "john.doe@example.com";
  await Employee.deleteMany({ email });
  const hashed = await bcrypt.hash("password123", 10);
  const emp = await Employee.create({
    empid: "EMP-1001",
    name: "John Doe",
    email,
    department: "Engineering",
    title: "Software Engineer",
    password: hashed
  });
  console.log("✅ Seeded employee:", emp.email, "password: password123");
  await mongoose.disconnect();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
