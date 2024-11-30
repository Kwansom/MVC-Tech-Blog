// User signup and login, session is created. Logout, session is destroyed.
const express = require("express");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const router = express.Router();

// SIGN UP new user route!
router.post("/", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    // Check if user already exists
    // console.log(req.body);
    const existUser = await User.findOne({ where: { username } });
    if (existUser) {
      return res.status(400).send("Username already exists");
    }
    // Create new user
    const user = await User.create({
      username,
      password,
      email,
    });

    // Store user info in session
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;

      res.status(200).json(user);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error signing up");
  }
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
    req.session.save(() => {
      req.session.user_id = user.id;
      req.session.logged_in = true;

      res.status(200).json(user);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error logging in");
  }
});



// Export the router so it can be used in server.js
module.exports = router;
