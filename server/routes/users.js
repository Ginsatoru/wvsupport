const express = require("express");
const verifyAdmin = require("../middleware/verifyAdmin");
const { listUsers, createUser, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

// Dashboard users — any logged-in admin/support account (no role restrictions yet)
router.use(verifyAdmin);
router.get("/", listUsers);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;