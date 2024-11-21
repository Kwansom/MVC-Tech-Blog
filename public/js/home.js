const express = require("express");
const router = express.Router();
const Post = require("../models/Post"); // Import Post model
const { ensureAuthenticated } = require("../middleware/auth"); // Import authentication middleware

// GET route to render the homepage
router.get("/", async (req, res) => {
  try {
    // Fetch all posts from the database
    const posts = await Post.findAll({
      order: [["createdAt", "DESC"]], // Sort by createdAt to show most recent posts first
    });

    // Check if the user is logged in (using session data)
    const isAuthenticated = req.session && req.session.userId;

    // Render the home page, passing the posts and session information
    res.render("home", {
      posts,
      session: { userId: req.session.userId }, // Pass userId to check if logged in
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching posts");
  }
});

module.exports = router;
