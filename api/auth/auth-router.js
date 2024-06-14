const express = require("express");
const bcrypt = require("bcryptjs"); // Assuming you're using bcrypt for password hashing
const db = require("../../data/db-config.js"); // Assuming you have a db-config for database access
const {
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength,
} = require("../auth/auth-middleware.js");
const router = express.Router();

router.post(
  "/register",
  checkUsernameFree,
  checkPasswordLength,
  async (req, res, next) => {
    console.log("IN REGISTER POST", req.body);
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      const [user] = await db("users")
        .insert({ username, password: hashedPassword })
        .returning(["user_id", "username"]);
      console.log("user", user);
      res.status(201).json({ user_id: user, username: username });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/login", checkUsernameExists, async (req, res, next) => {
  try {
    console.log("IN LOGIN POST");
    const { username, password } = req.body;
    const user = await db("users").where({ username: username }).first();

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      res.status(200).json({ message: `Welcome ${user.username}!` });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    next(err);
  }
});

router.get("/logout", (req, res) => {
  if (req.session && req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Error logging out" });
      } else {
        res.status(200).json({ message: "Logged out" });
      }
    });
  } else {
    res.status(200).json({ message: "No session" });
  }
});

module.exports = router;
