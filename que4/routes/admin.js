import express from "express";
import Admin from "../models/Admin.js";
import Employee from "../models/Employee.js";
import { generateEmpId, generateRawPassword, hashPassword, calcTotal } from "../utils/generate.js";
import { sendEmployeeCredentials } from "../utils/mailer.js";

const router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.session.adminId) return next();
  req.flash("error", "Please login first.");
  return res.redirect("/login");
}

router.get("/login", (req, res) => {
  if (req.session.adminId) return res.redirect("/dashboard");
  res.render("login", { title: "Admin Login" });
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body ?? {};
    const admin = await Admin.findOne({ username });
    if (!admin) {
      req.flash("error", "Invalid credentials.");
      return res.redirect("/login");
    }
    const ok = await admin.comparePassword(password);
    if (!ok) {
      req.flash("error", "Invalid credentials.");
      return res.redirect("/login");
    }
    req.session.adminId = admin._id;
    req.flash("success", "Welcome back!");
    return res.redirect("/dashboard");
  } catch (e) {
    console.error("Login error:", e);
    req.flash("error", "Something went wrong.");
    res.redirect("/login");
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

router.get("/dashboard", isLoggedIn, async (req, res) => {
  const count = await Employee.countDocuments();
  res.render("dashboard", { title: "Dashboard", count });
});

router.get("/employees", isLoggedIn, async (req, res) => {
  const employees = await Employee.find().sort({ createdAt: -1 }).lean();
  res.render("employees/index", { title: "Employees", employees });
});

router.get("/employees/new", isLoggedIn, (req, res) => {
  res.render("employees/new", { title: "Add Employee" });
});

router.post("/employees", isLoggedIn, async (req, res) => {
  try {
    const { name, email, basic = 0, hra = 0, da = 0, bonus = 0, deductions = 0 } = req.body;

    let empid = generateEmpId();
    const rawPassword = generateRawPassword();

    for (let i = 0; i < 3; i++) {
      const exists = await Employee.findOne({ empid });
      if (!exists) break;
      empid = generateEmpId();
    }

    const total = calcTotal({ basic, hra, da, bonus, deductions });
    const hashed = await hashPassword(rawPassword);

    const employee = await Employee.create({
      empid,
      name,
      email,
      password: hashed,
      salary: { basic, hra, da, bonus, deductions, total }
    });

    await sendEmployeeCredentials({ to: email, name, empid: employee.empid, rawPassword });

    req.flash("success", `Employee ${name} added and email sent.`);
    res.redirect("/employees");
  } catch (e) {
    console.error("Create employee error:", e.message);
    if (String(e.message).includes("duplicate key")) {
      req.flash("error", "Duplicate email or empid. Try again.");
    } else {
      req.flash("error", "Could not add employee.");
    }
    res.redirect("/employees/new");
  }
});

router.get("/employees/:id/edit", isLoggedIn, async (req, res) => {
  const employee = await Employee.findById(req.params.id).lean();
  if (!employee) {
    req.flash("error", "Employee not found.");
    return res.redirect("/employees");
  }
  res.render("employees/edit", { title: "Edit Employee", employee });
});

router.put("/employees/:id", isLoggedIn, async (req, res) => {
  try {
    const { name, basic = 0, hra = 0, da = 0, bonus = 0, deductions = 0 } = req.body;
    const total = calcTotal({ basic, hra, da, bonus, deductions });

    await Employee.findByIdAndUpdate(req.params.id, {
      name,
      "salary.basic": basic,
      "salary.hra": hra,
      "salary.da": da,
      "salary.bonus": bonus,
      "salary.deductions": deductions,
      "salary.total": total
    });

    req.flash("success", "Employee updated.");
    res.redirect("/employees");
  } catch (e) {
    console.error("Update employee error:", e);
    req.flash("error", "Could not update employee.");
    res.redirect("/employees");
  }
});

router.delete("/employees/:id", isLoggedIn, async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    req.flash("success", "Employee deleted.");
    res.redirect("/employees");
  } catch (e) {
    console.error("Delete employee error:", e);
    req.flash("error", "Could not delete employee.");
    res.redirect("/employees");
  }
});

export default router;
