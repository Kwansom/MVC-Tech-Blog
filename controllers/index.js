const express = require("express");
const userRoutes = require("./User"); // Import user routes
const blogRoutes = require("./Blog"); // Import blog routes
const postRoutes = require("./Post"); // Import post routes

const router = express.Router(); // Create a router instance

router.get("/", (req, res) => {
  res.render("home"); // Render the home page, or you could add more logic here if needed
});

// Define all routes
router.use("/", userRoutes); // User routes (signup, login, logout)
router.use("/blog", blogRoutes); // Blog routes (homepage, post view, etc.)
router.use("/post", postRoutes); // Post routes (dashboard, create, update, delete)

// Export the router instance
module.exports = router;
