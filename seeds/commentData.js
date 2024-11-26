const { Comment } = require("../models");

const commentData = [
  {
    content: "Thanks for explaining this!",
    user_id: 1,
    post_id: 3,
  },
  {
    content: "I can agree with that",
    user_id: 2,
    post_id: 4,
  },
  {
    content: "I never thought of it that way",
    user_id: 3,
    post_id: 2,
  },
  {
    content: "Good to kNodew!",
    user_id: 4,
    post_id: 1,
  },
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;
