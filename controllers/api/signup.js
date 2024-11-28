// const express = require("express");
// const router = express.Router();
// const User = require("../../models/user");

// // GET route to render the signup form

// // POST route to handle signup form submission
// router.post("/signup", async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Check if user already exists
//     const existingUser = await User.findOne({ where: { username } });
//     if (existingUser) {
//       return res.status(400).render("signup", {
//         error: "Username already taken, please choose another one.",
//       });
//     }

//     // Create a new user and save to the database
//     const newUser = await User.create({ username, email, password });
//     // Maybe sign user in when created

//     // Redirect to login page after successful signup
//     res.redirect("/dashboard");
//   } catch (error) {
//     console.error(error);
//     res.status(500).render("signup", {
//       error: "An error occurred during signup. Please try again later.",
//     });
//   }
// });

// module.exports = router;
