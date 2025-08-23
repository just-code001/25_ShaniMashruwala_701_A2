const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const indexRouter = require("./routes/index");

const app = express();

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // serve uploads folder

// Routes
app.use("/", indexRouter);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
