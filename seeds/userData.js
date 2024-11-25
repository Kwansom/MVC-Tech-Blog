const { User } = require("../models");

const userData = [
  {
    username: "James",
    email: "jbond@gmail.com",
    password: "password",
  },
  {
    username: "N8",
    email: "Alva@hotmail.com",
    password: "root",
  },
  {
    username: "Kw",
    email: "kwan@yyahoo.com",
    password: "1234",
  },
  {
    username: "JO",
    email: "Orelord@sbc.global.net",
    password: "abcd",
  },
];

const seedUsers = () =>
  User.bulkCreate(userData, { individualHooks: true, returning: true });

module.exports = seedUsers;
