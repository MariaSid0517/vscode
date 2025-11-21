// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");

// ===========================
// POST /register
// ===========================
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required." });

  try {
    // Check if email already exists
    const [existing] = await db.query(
      "SELECT * FROM usercredentials WHERE email = ?",
      [email]
    );

    if (existing.length > 0)
      return res.status(400).json({ error: "Email already registered." });

    // ---------------------------
    // 🔐 HASH THE PASSWORD HERE
    // ---------------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a username from the email (before the @)
    const username = email.split("@")[0];

    // Insert new user into database
    const [result] = await db.query(
      `INSERT INTO usercredentials 
       (username, password_hash, email, created_at, role)
       VALUES (?, ?, ?, NOW(), 'volunteer')`,
      [username, hashedPassword, email]
    );

    return res.status(201).json({
      user_id: result.insertId,
      role: "volunteer",
      message: "User registered successfully"
    });

  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Registration failed." });
  }
});

// ===========================
// POST /login
// ===========================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password required." });

  try {
    const [rows] = await db.query(
      "SELECT * FROM usercredentials WHERE email = ?",
      [email]
    );

    const user = rows[0];
    if (!user)
      return res.status(401).json({ error: "Invalid email or password." });

    // -----------------------------------
    // 🔐 VERIFY HASHED PASSWORD HERE
    // -----------------------------------
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password." });

    return res.json({
      user_id: user.user_id,
      role: user.role,
      message: "Login successful"
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed." });
  }
});

module.exports = router;
