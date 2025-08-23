import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";
import "./config/db.js";

dotenv.config();

async function run() {
  const username = "admin";
  const password = "admin123";
  await Admin.deleteMany({ username });
  await Admin.create({ username, password }); // pre-save hook will hash
  console.log("✅ Admin seeded => username: admin, password: admin123");
  await mongoose.disconnect();
}
run().catch((e) => {
  console.error(e);
  process.exit(1);
});
