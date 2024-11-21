const express = require("express");
const { Comment } = require("../models/Comment");
const { User } = require("../models/user");
const { Post } = require("../models/Post");
const router = express.Router(); // Initialize a new router

// Get all posts for the dashboard
router.get("/dashboard", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect("/login");
    }

    const posts = await Post.findAll({
      where: { userId: req.session.userId },
      order: [["createdAt", "DESC"]], // Order posts by the newest first
    });
    res.render("dashboard", { posts }); // Render the homepage with the posts
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching posts");
  }
});

// Get post
router.get("/dashboard/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Comment, include: User }, User], // Include comments and the post creator
    });

    if (!post) return res.status(404).send("Post not found");
    res.render("post", { post }); // Render the post page with the post details
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching post");
  }
});

// Create a new comment on a post
router.post("/dashboard/:postId", async (req, res) => {
  try {
    await Comment.create({
      content: req.body.content,
      postId: req.params.postId,
      userId: req.session.userId,
    });
    res.redirect(`/dashboard/${req.params.postId}`); // Redirect back to the post page
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating comment");
  }
});

// Create a new blog post
router.post("/dashboard/post", async (req, res) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      contents: req.body.contents,
      userId: req.session.userId,
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating post");
  }
});

// Update an existing blog post
router.put("/dashboard/post/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (post.userId !== req.session.userId) {
      return res.status(403).send("You are not authorized to edit this post");
    }

    post.title = req.body.title;
    post.contents = req.body.contents;
    await post.save(); // Save the updated post

    res.redirect("/dashboard"); // Redirect to the dashboard after updating
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating post");
  }
});

// Delete a blog post
router.delete("/dashboard/post/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (post.userId !== req.session.userId) {
      return res.status(403).send("You are not authorized to delete this post");
    }

    await post.destroy(); // Delete the post from the database
    res.redirect("/dashboard"); // Redirect to the dashboard after deleting
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting post");
  }
});

// Export the router so it can be used in server.js
module.exports = router;
