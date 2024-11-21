const userRoutes = require("./User"); // Import user routes
const blogRoutes = require("./Blog"); // Import blog routes
const postRoutes = require("./Post"); // Import post routes

// Combine all route files and export them
module.exports = (app) => {
  app.use("/", userRoutes); // User routes (signup, login, logout)
  app.use("/blog", blogRoutes); // Blog routes (homepage, post view, etc.)
  app.use("/post", postRoutes); // Post routes (dashboard, create, update, delete)
};
