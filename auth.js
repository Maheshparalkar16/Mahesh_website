const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../db");

const router = express.Router();
const JWT_SECRET = "dev_secret_change_me";

/* REGISTER */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Missing fields" });

  const [existing] = await db.query(
    "SELECT id FROM users WHERE email=?",
    [email]
  );
  if (existing.length)
    return res.status(409).json({ error: "Email already registered" });

  const strong =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password);

  if (!strong)
    return res.status(400).json({ error: "Weak password" });

  const password_hash = await bcrypt.hash(password, 10);

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = Date.now() + 15 * 60 * 1000;

  await db.query(
    `INSERT INTO users (email, password_hash, verify_token, token_expiry)
     VALUES (?, ?, ?, ?)`,
    [email, password_hash, token, expiry]
  );

  res.json({
    message: "Registered. Verify your email.",
    verifyUrl: `http://localhost:3000/verify.html?token=${token}&email=${email}`,
  });
});

/* VERIFY EMAIL */
router.get("/verify", async (req, res) => {
  const { token, email } = req.query;

  const [rows] = await db.query(
    `SELECT id, token_expiry FROM users
     WHERE email=? AND verify_token=?`,
    [email, token]
  );

  if (!rows.length)
    return res.status(400).json({ error: "Invalid token" });

  if (Date.now() > rows[0].token_expiry)
    return res.status(400).json({ error: "Token expired" });

  await db.query(
    `UPDATE users SET verified=true, verify_token=NULL, token_expiry=NULL
     WHERE email=?`,
    [email]
  );

  res.json({ message: "Email verified ✅" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query(
    `SELECT * FROM users WHERE email=?`,
    [email]
  );

  if (!rows.length)
    return res.status(401).json({ error: "Invalid credentials" });

  const user = rows[0];
  if (!user.verified)
    return res.status(403).json({ error: "Email not verified" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok)
    return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, role: user.role });
});

/* ROLE‑PROTECTED ROUTE */
router.get("/admin", async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.sendStatus(401);

  const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
  if (decoded.role !== "admin") return res.sendStatus(403);

  res.json({ secret: "Admin only data ✅" });
});

module.exports = router;