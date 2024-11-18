const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store); // To persist the session data in the database

const app = express();
const PORT = process.env.PORT || 3001;

// Handlebars as template engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 30, // Session will expire after 30 minutes
  },
  resave: false,
  saveUnitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Initialize session middleware
app.use(session(sess));

app.use(routes);

// Syncs sequelize models and starts the server
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// //Importing routers
// const blogController = require("./controllers/Blog");
// app.use("/", blogController);
