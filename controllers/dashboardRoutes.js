const express = require("express");
const router = express.Router();
const { Comment, Post, User } = require("../models");
// const Post = require("../models/Post");
// const User = require("../models/user");
// const Comment = require("../")
const withAuth = require("../utils/auth");

// Middleware to ensure the user is logged in before accessing the dashboard
router.use(withAuth);

// GET route to render the user's dashboard
router.get("/", async (req, res) => {
  try {
    // Fetch posts created by the logged-in user
    const results = await Post.findAll({
      where: { user_id: req.session.user_id }, // Assuming user ID is stored in session
      order: [["createdAt", "DESC"]], // Order by creation date (most recent first)
    });
    // Serializing post results data
    const posts = results.map((item) => {
      return item.get({ plain: true });
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
router.post("/post", async (req, res) => {
  try {
    const { title, content } = req.body;

    // Create a new post linked to the logged-in user
    await Post.create({
      title,
      content,
      user_id: req.session.user_id, // Use the logged-in user's ID
    });

    // Redirect to the dashboard after post creation
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating post");
  }
});

// GET route to render the 'edit post' form
router.get("/edit/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const result = await Post.findOne({
      where: { id: postId, user_id: req.session.user_id }, // Ensure the post belongs to the logged-in user
    });
    // Serializing single object
    const post = result.get({ plain: true });
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

// Get a single post
router.get("/post/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Comment, include: User }, User], // Include comment, include content and the post creator
    });

    if (!post) return res.status(404).send("Post not found");
    res.render("single-post", { post }); // Render the post page with the post details
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching post");
  }
});

//Update blog post
// router.put("/dashboard/post/:id", async (req, res) => {
//   try {
//     const post = await Post.findByPk(req.params.id);
//     if (post.userId !== req.session.userId) {
//       return res.status(403).send("You are not authorized to edit this post");
//     }
//     post.title = req.body.title;
//     post.contents = req.body.contents;
//     await post.save();
//     res.redirect("/dashboard");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error updating post");
//   }
// });

// PUT route to update an existing post
router.put("/post/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content } = req.body;

    const post = await Post.findOne({
      where: { id: postId, user_id: req.session.user_id }, // Ensure the post belongs to the logged-in user
    });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Update the post with new title and contents
    await post.update({ title, content });

    // Sending post back
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating post");
  }
});

// Delete route to delete a post
router.delete("/delete/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Post.findOne({
      where: { id: postId, user_id: req.session.user_id }, // Ensure the post belongs to the logged-in user
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
