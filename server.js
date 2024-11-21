const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const routes = require("./controllers");
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Handlebars setup
app.engine("handlebars", exphbs.engine()); // Correct initialization
app.set("view engine", "handlebars");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
const sess = {
  secret: process.env.SESSION_SECRET || 'defaultSecretKey',  // Use default key if not set in .env
  cookie: {
    maxAge: 1000 * 60 * 30, // 30 minutes
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

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
