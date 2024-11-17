const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const routes = require('./controllers');

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
