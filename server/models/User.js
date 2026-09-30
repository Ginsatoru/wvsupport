const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ROLES = ["admin", "support"];

const UserSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: "" },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please enter a valid email"],
  },
  password: { type: String, required: true },
  // Dashboard role — no permission differences yet, both have full access
  role: { type: String, enum: ROLES, default: "admin" },
  // Dashboard access; every user created from the Users page gets it
  isAdmin: { type: Boolean, default: false },
  passwordChangedAt: { type: Date }, // tokens issued before this are rejected
  createdAt: { type: Date, default: Date.now },
});

// Password hashing middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  if (!this.isNew) this.passwordChangedAt = new Date();
  next();
});

UserSchema.statics.ROLES = ROLES;

module.exports = mongoose.model("User", UserSchema);