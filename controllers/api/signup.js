const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// GET route to render the signup form

// POST route to handle signup form submission
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).render("signup", {
        error: "Username already taken, please choose another one.",
      });
    }

    // Create a new user and save to the database
    const newUser = await User.create({ username, password });

    // Redirect to login page after successful signup
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.status(500).render("signup", {
      error: "An error occurred during signup. Please try again later.",
    });
  }
});

module.exports = router;
