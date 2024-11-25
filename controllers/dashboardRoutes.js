const express = require("express");
const router = express.Router();
const Post = require("../models/Post"); 
const User = require("../models/user"); 
const withAuth = require("../utils/auth");

// Middleware to ensure the user is logged in before accessing the dashboard
router.use(withAuth);

// GET route to render the user's dashboard
router.get("/dashboard", async (req, res) => {
  try {
    // Fetch posts created by the logged-in user
    const posts = await Post.findAll({
      where: { userId: req.session.userId }, // Assuming user ID is stored in session
      order: [["createdAt", "DESC"]], // Order by creation date (most recent first)
    });

    // Render the dashboard template, passing the user's posts
    res.render("dashboard", { posts });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts");
  }
});

// GET route to render the 'new post' form
router.get("/dashboard/new", (req, res) => {
  res.render("new-post"); // Render the template for creating a new post
});

// POST route to create a new post
router.post("/dashboard/new", async (req, res) => {
  try {
    const { title, contents } = req.body;

    // Create a new post linked to the logged-in user
    await Post.create({
      title,
      contents,
      userId: req.session.userId, // Use the logged-in user's ID
    });

    // Redirect to the dashboard after post creation
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating post");
  }
});

// GET route to render the 'edit post' form
router.get("/dashboard/edit/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findOne({
      where: { id: postId, userId: req.session.userId }, // Ensure the post belongs to the logged-in user
    });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Render the edit form with the existing post data
    res.render("edit-post", { post });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving post");
  }
});

// POST route to update an existing post
router.post("/dashboard/edit/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, contents } = req.body;

    const post = await Post.findOne({
      where: { id: postId, userId: req.session.userId }, // Ensure the post belongs to the logged-in user
    });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Update the post with new title and contents
    await post.update({ title, contents });

    // Redirect to the dashboard after post update
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating post");
  }
});

// GET route to delete a post
router.get("/dashboard/delete/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findOne({
      where: { id: postId, userId: req.session.userId }, // Ensure the post belongs to the logged-in user
    });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Delete the post from the database
    await post.destroy();

    // Redirect to the dashboard after post deletion
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting post");
  }
});

module.exports = router;
