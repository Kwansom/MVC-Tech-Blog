const express = require("express");
const { User } = require("../../models/user");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Handles login form submission
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(400).send("Username not found");
    }

    // Check if password is correct
    const validPassword = user.checkPassword(password);
    if (!validPassword) {
      return res.status(400).send("Incorrect password");
    }

    // Store user session
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });

    // Redirect to homepage/dashboard
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in");
  }
});

module.exports = router;
