const express = require("express");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Validation rules
const validateForm = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Enter valid email"),
  body("password").isLength({ min: 5 }).withMessage("Password min 5 chars"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  body("gender").notEmpty().withMessage("Select gender"),
  body("hobbies").notEmpty().withMessage("Select at least one hobby"),
];

// GET form
router.get("/", (req, res) => {
  res.render("form", { errors: {}, old: {} });
});

// POST form
router.post(
  "/register",
  upload.fields([{ name: "profilePic", maxCount: 1 }, { name: "otherPics" }]),
  validateForm,
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("form", {
        errors: errors.mapped(),
        old: req.body,
      });
    }

    const userData = {
      username: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      hobbies: Array.isArray(req.body.hobbies) ? req.body.hobbies : [req.body.hobbies],
      profilePic: req.files["profilePic"] ? req.files["profilePic"][0].filename : null,
      otherPics: req.files["otherPics"]
        ? req.files["otherPics"].map((f) => f.filename)
        : [],
    };

    // Save user data into a file (for download later)
    const filePath = path.join(__dirname, "../public/uploads/userdata.json");
    fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));

    res.render("result", { userData });
  }
);

// Route for file download
router.get("/download", (req, res) => {
  const filePath = path.join(__dirname, "../public/uploads/userdata.json");
  res.download(filePath, "userdata.json");
});

module.exports = router;
