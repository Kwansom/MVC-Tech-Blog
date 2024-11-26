const { Post } = require("../models");

const postData = [
  {
    title: "Why know NodeJS?",
    content:
      "It is an open source server environment! It can create, open, read, write, delete, and close files on the server :]",
    user_id: 1,
  },
  {
    title: "What is the point of Object Oriented programming?",
    content:
      "When you want to achieve something, you first abstract an object from your goal. You create the object and then use it.",
    user_id: 2,
  },
  {
    title: "OOP VS. ORM",
    content:
      "One is a programming language, while the other translates it and creates a structured map to help developers understand the database structure.",
    user_id: 3,
  },
  {
    title: "Coding is art",
    content: "VS code is my sheet music for writing my symphonies",
    user_id: 4,
  },
];

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;
