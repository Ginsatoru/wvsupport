// Create a dashboard admin, or reset an existing one's password.
// Usage:  node adminacc.js <email>   → then type the password when asked (hidden, not saved anywhere)
require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const User = require("./models/User");

// Ask for input without echoing it to the screen
const askHidden = (question) =>
  new Promise((resolve) => {
    const stdin = process.stdin;
    let value = "";
    process.stdout.write(question);
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    const onKey = (key) => {
      if (key === "\r" || key === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.off("data", onKey);
        process.stdout.write("\n");
        resolve(value);
      } else if (key === "\u0003") {
        process.exit(1); // Ctrl+C
      } else if (key === "\u0008" || key === "\u007f") {
        value = value.slice(0, -1); // Backspace
      } else {
        value += key;
      }
    };
    stdin.on("data", onKey);
  });

(async () => {
  const email = (process.argv[2] || "").trim().toLowerCase();
  if (!email) {
    console.error("Usage: node adminacc.js <email>");
    process.exit(1);
  }

  const password = await askHidden("New password (8+ characters): ");
  if (password.length < 8) {
    console.error("❌ Password must be at least 8 characters");
    process.exit(1);
  }
  if ((await askHidden("Confirm password: ")) !== password) {
    console.error("❌ Passwords don't match");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const user = (await User.findOne({ email })) || new User({ email, role: "admin" });
    user.password = password; // hashed by the model on save
    user.isAdmin = true;
    await user.save();
    console.log(`✅ Admin ready: ${user.email}`);
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
})();