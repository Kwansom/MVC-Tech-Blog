const express = require("express");
const userRoutes = require("./user"); // Import user routes
// const blogRoutes = require("./Blog"); // Import blog routes
const postRoutes = require("./post"); // Import post routes
const commentRoutes = require("./comment");

const router = express.Router(); // Create a router instance

// Define all routes
router.use("/user", userRoutes); // User routes (signup, login, logout)
// router.use("/blog", blogRoutes); // Blog routes (homepage, post view, etc.)
router.use("/comment", commentRoutes);
router.use("/post", postRoutes); // Post routes (dashboard, create, update, delete)

// Export the router instance
module.exports = router;
