const User = require("../models/User");

const PUBLIC_FIELDS = "name email role createdAt";
const MIN_PASSWORD = 8;

const str = (value) => (typeof value === "string" ? value.trim() : "");
const toPublic = (user) => ({ _id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
const bad = (res, message) => res.status(400).json({ success: false, message });

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "That email is already in use" });
    if (error.name === "ValidationError") return bad(res, Object.values(error.errors)[0]?.message || "Invalid data");
    console.error(`User ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// Validates role / password when present; returns an error message or null
const checkFields = ({ role, password }, { requirePassword = false } = {}) => {
  if (role !== undefined && !User.ROLES.includes(role)) return "Role must be admin or support";
  if (requirePassword || password) {
    if (typeof password !== "string" || password.length < MIN_PASSWORD) {
      return `Password must be at least ${MIN_PASSWORD} characters`;
    }
  }
  return null;
};

// GET /api/users
exports.listUsers = handle("fetch users", async (req, res) => {
  const users = await User.find({ isAdmin: true }).select(PUBLIC_FIELDS).sort({ createdAt: 1 }).lean();
  res.json({ success: true, data: users });
});

// POST /api/users  { name, email, password, role }
exports.createUser = handle("create user", async (req, res) => {
  const email = str(req.body.email).toLowerCase();
  const { password, role = "support" } = req.body;
  if (!email) return bad(res, "Email is required");
  const error = checkFields({ role, password }, { requirePassword: true });
  if (error) return bad(res, error);

  const user = await User.create({ name: str(req.body.name), email, password, role, isAdmin: true });
  res.status(201).json({ success: true, data: toPublic(user) });
});

// PATCH /api/users/:id  { name?, email?, role?, password? }
exports.updateUser = handle("update user", async (req, res) => {
  const error = checkFields(req.body);
  if (error) return bad(res, error);

  const user = await User.findOne({ _id: req.params.id, isAdmin: true });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  if (req.body.name !== undefined) user.name = str(req.body.name);
  if (req.body.email !== undefined) {
    const email = str(req.body.email).toLowerCase();
    if (!email) return bad(res, "Email is required");
    user.email = email;
  }
  if (req.body.role !== undefined) user.role = req.body.role;
  if (req.body.password) user.password = req.body.password; // hashed by the model on save

  await user.save();
  res.json({ success: true, data: toPublic(user) });
});

// DELETE /api/users/:id — can't delete yourself or the last account
exports.deleteUser = handle("delete user", async (req, res) => {
  if (String(req.admin.id) === String(req.params.id)) return bad(res, "You can't delete your own account");
  if ((await User.countDocuments({ isAdmin: true })) <= 1) return bad(res, "You can't delete the last account");

  const user = await User.findOneAndDelete({ _id: req.params.id, isAdmin: true });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true });
});