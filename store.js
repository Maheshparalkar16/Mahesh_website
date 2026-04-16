// server/store.js
const bcrypt = require("bcryptjs");

const users = new Map(); // email -> user

function seedAdmin() {
  const email = "admin@example.com";
  if (users.has(email)) return;

  const passwordHash = bcrypt.hashSync("Admin@1234", 10);
  users.set(email, {
    id: "u_admin",
    email,
    passwordHash,
    role: "admin",
    verified: true,
    verifyTokenHash: null,
    verifyTokenExp: null
  });
}

module.exports = { users, seedAdmin };