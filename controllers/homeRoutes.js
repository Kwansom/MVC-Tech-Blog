// Rendering pages
// Handle HTTP requests
const express = require("express");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/user");
const router = express.Router();
const ensureAuthenticated = require("../utils/auth");
const session = require("express-session");

// Homepage for all posts
router.get("/", async (req, res) => {
  try {
    const results = await Post.findAll({
      include: User, // include user who posted
      order: [["createdAt", "DESC"]],
    });
    // Serializing // going thru each item in db make a copy but keep plain version
    const posts = results.map((item) => {
      return item.get({ plain: true });
    });
    // console.log(posts);
    res.render("home", { posts, session: req.session });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching posts");
  }
});

// Render login page
router.get("/login", (req, res) => {
  res.render("login", { session: req.session });
});

// Render signup page
router.get("/signup", (req, res) => {
  res.render("signup", { session: req.session });
});

// GET route to render the user's dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {
    // Fetch posts created by the logged-in user
    const results = await Post.findAll({
      where: { user_id: req.session.user_id }, // user_id is stored in session
      order: [["createdAt", "DESC"]], // Order by creation date (most recent first)
    });
    // maps posts to plain objects
    const posts = results.map((item) => {
      return item.get({ plain: true });
    });

    //Fetching the user data using user_id from session
    const user = await User.findByPk(req.session.user_id);

    // Render the dashboard template, passing the user's posts
    res.render("dashboard", {
      posts,
      user: user.get({ plain: true }),
      session: req.session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving posts");
  }
});

// GET route to render the 'new post' form
router.get("/dashboard/new", ensureAuthenticated, (req, res) => {
  res.render("new-post", { session: req.session }); // Render the template for creating a new post
});

// router.get("/dashboard/edit", ensureAuthenticated, (req, res) => {
//   res.render("edit-post", { session: req.session }); // Render the template page for editing a post
// });

// GET post and comments
router.get("/dashboard/post/:id", ensureAuthenticated, async (req, res) => {
  try {
    console.log("Fetcing post with ID", req.params.id);
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Comment, include: User }, User], // include comments and user
    });
    const postData = post.get({ plain: true });
    // console.log(postData);
    if (!postData) return res.status(404).send("Post not found");
    res.render("single-post", { postData, session: req.session });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching post");
  }
});

// Handles user log-out route
router.get("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.redirect("/"); // Redirect to homepage after logging out
    });
  } else {
    res.status(404).end();
  }
});

//Belongs in API route
// POST route to create a new post
// router.post("/dashboard/new", ensureAuthenticated, async (req, res) => {
//   try {
//     const { title, content } = req.body;

//     // Create a new post linked to the logged-in user
//     await Post.create({
//       title,
//       contents,
//       userId: req.session.userId, // Use the logged-in user's ID
//     });

//     // Redirect to the dashboard after post creation
//     res.redirect("/dashboard");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error creating post");
//   }
// });

// // GET route to render the 'edit post' form
// router.get("/dashboard/edit/:id", ensureAuthenticated, async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const post = await Post.findOne({
//       where: { id: postId, userId: req.session.userId }, // Ensure the post belongs to the logged-in user
//     });

//     if (!post) {
//       return res.status(404).send("Post not found");
//     }

//     // Render the edit form with the existing post data
//     res.render("edit-post", { post });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error retrieving post");
//   }
// });

// Belongs in API route
// POST route to update an existing post
// router.post("/dashboard/edit/:id", async (req, res) => {
//   try {
//     const postId = req.params.id;
//     const { title, contents } = req.body;

//     const post = await Post.findOne({
//       where: { id: postId, userId: req.session.userId }, // Ensure the post belongs to the logged-in user
//     });

//     if (!post) {
//       return res.status(404).send("Post not found");
//     }

//     // Update the post with new title and contents
//     await post.update({ title, contents });

//     // Redirect to the dashboard after post update
//     res.redirect("/dashboard");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error updating post");
//   }
// });

// Belongs in API
// GET route to delete a post
// router.get("/dashboard/delete/:id", async (req, res) => {
//   try {
//     const postId = req.params.id;

//     const post = await Post.findOne({
//       where: { id: postId, userId: req.session.userId }, // Ensure the post belongs to the logged-in user
//     });

//     if (!post) {
//       return res.status(404).send("Post not found");
//     }

//     // Delete the post from the database
//     await post.destroy();

//     // Redirect to the dashboard after post deletion
//     res.redirect("/dashboard");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error deleting post");
//   }
// });

// Should go into post routes
// // Create new blog post
// router.post("/dashboard/post", async (req, res) => {
//   try {
//     const post = await Post.create({
//       title: req.body.title,
//       contents: req.body.contents,
//       userId: req.session.userId,
//     });
//     res.redirect("/dashboard");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error creating post");
//   }
// });

// Delete Blog post
// router.delete("/dashboard/post/:id", async (req, res) => {
//   try {
//     const post = await Post.findByPk(req.params.id);
//     if (post.userId !== req.session.userId) {
//       return res.status(403).send("You are not authorized to delete this post");
//     }
//     await post.destroy();
//     res.redirect("/dashboard");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error deleting post");
//   }
// });

module.exports = router;
