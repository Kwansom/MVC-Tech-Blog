// Handle HTTP requests
const express = require("express");
const { Post, Comment, User } = require("../models");
const router = express.Router();

// Homepage for all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: User, // include user who posted
      order: [["createdAt", "DESC"]],
    });
    res.render("home", { posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching posts");
  }
});

// Single post and comments
router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Comment, include: User }, User], // include comments and user
    });
    if (!post) return res.status(404).send("Post not found");
    res.render("post", { post });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching post");
  }
});

// Create new comment
router.post("/comment/:postId", async (req, res) => {
  try {
    await Comment.create({
      content: req.body.content,
      postId: req.params.postId,
      userId: req.session.userId,
    });
    res.redirect("/post/${req.params.postId}"); // redirect to new post
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating comment");
  }
});

// Create new blog post
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

//Update blog post
router.put("/dashboard/post/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (post.userId !== req.session.userId) {
      return res.status(403).send("You are not authorized to edit this post");
    }
    post.title = req.body.title;
    post.contents = req.body.contents;
    await post.save();
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating post");
  }
});

// Delete Blog post
router.delete("/dashboard/post/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (post.userId !== req.session.userId) {
      return res.status(403).send("You are not authorized to delete this post");
    }
    await post.destroy();
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting post");
  }
});

module.exports = router;
