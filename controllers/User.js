// User signup and login, session is created. Logout, session is destroyed.
const express = require("express");
const { User } = require("../db/models");
const bcrypt = require("bcryptjs");
const router = express.Router(); // Initialize a new router

// Sign up route
router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if user already exists
    const existUser = await User.findOne({ where: { username } });
    if (existUser) {
      return res.status(400).send("Username already exists");
    }
    // Create new user
    const newUser = await User.create({
      username,
      password,
    });
    // Store user info in session
    req.session.userId = newUser.id;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error signing up");
  }
});

// Login route
router.get("/login", async (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).send("Username not found");
    }
    //Check password
    const validPassword = user.checkPassword(password);
    if (!validPassword) {
      return res.status(400).send("Incorrect password");
    }
    // Store user info in session
    req.session.userId = user.id;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
});

// Handles user log-out route
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/"); // Redirect to homepage after logging out
  });
});

// Export the router so it can be used in server.js
module.exports = router;
