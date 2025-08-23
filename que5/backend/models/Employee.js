import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  empid: { type: String, unique: true, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  department: { type: String, default: "General" },
  title: { type: String, default: "Employee" },
  joinDate: { type: Date, default: Date.now },
  password: { type: String, required: true } // hashed
}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);
