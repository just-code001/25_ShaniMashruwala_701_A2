const express = require("express");
const session = require("express-session");
const RedisStore = require("connect-redis").default; // ✅ correct import for v7+
const { createClient } = require("redis");

const app = express();

// Create Redis client
let redisClient = createClient({
  url: "redis://127.0.0.1:6379",
  legacyMode: true, // helps with compatibility
});
redisClient.connect().catch(console.error);

// Session middleware
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 10 }, // 10 mins
  })
);

// Routes
app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`<h1>Welcome back! You visited ${req.session.views} times.</h1>`);
  } else {
    req.session.views = 1;
    res.send("<h1>Welcome! First visit.</h1>");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error destroying session");
    }
    res.clearCookie("connect.sid");
    res.send("<h1>Session destroyed. Goodbye!</h1>");
  });
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
