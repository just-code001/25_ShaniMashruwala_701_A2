import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    da: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  { _id: false }
);

const employeeSchema = new mongoose.Schema(
  {
    empid: { type: String, unique: true, required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, // hashed
    salary: { type: salarySchema, default: () => ({}) }
  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
