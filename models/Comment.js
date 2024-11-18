const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const User = require("./user");
const Post = require("./Post");

class Comment extends Model {}

Comment.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Comment",
  }
);

Comment.belongsTo(User, { foreignKey: "userId" });
Comment.belongsTo(Post, { foreignKey: "postId" });

module.exports = Comment;
