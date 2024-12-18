// Importing dependencies
const express = require("express"); // provides routing and handles http requests
const exphbs = require("express-handlebars"); // integrates Express with handlebars
const path = require("path");
const session = require("express-session"); // to store user session data
const routes = require("./controllers"); // routes
const sequelize = require("./config/connection"); // connection to db
const SequelizeStore = require("connect-session-sequelize")(session.Store); // used to store session data in the db
const helpers = require("./utils/helpers");

// Setting up Express Application
const app = express(); // runs server
const PORT = process.env.PORT || 3001;
const hbs = exphbs.create({ helpers });

// Handlebars setup
app.engine("handlebars", hbs.engine); // registers view engine as handlebars
app.set("view engine", "handlebars"); // tells Express to look for views to render a page

// Middleware
app.use(express.json()); // Parses incoming JSON data from the request body
app.use(express.urlencoded({ extended: true })); // Parses URL encoded data from requset body
app.use(express.static(path.join(__dirname, "public")));
// Serve static files from the "assets" folder
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Session setup
const sess = {
  secret: process.env.SESSION_SECRET || "defaultSecretKey", // ensures session is secured. Session ID cookie
  cookie: {
    maxAge: 1000 * 60 * 30, // 30 minutes is how long the session cookie will be valid
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Use routes
app.use(routes);

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
