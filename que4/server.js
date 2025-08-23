import express from "express";
import session from "express-session";
import flash from "connect-flash";
import path from "path";
import methodOverride from "method-override";
import dotenv from "dotenv";
import expressLayouts from "express-ejs-layouts";
import { fileURLToPath } from "url";

import "./config/db.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// EJS + Layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout"); // views/layout.ejs
app.use(expressLayouts);

// Static + body parsing
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Method override for PUT/DELETE in forms
app.use(methodOverride("_method"));

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 4 } // 4 hours
  })
);

// Flash messages
app.use(flash());

// Expose flash + session to templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.adminId = req.session.adminId || null;
  next();
});

// Routes
app.use("/", adminRoutes);

// 404
app.use((req, res) => res.status(404).send("Not Found"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
