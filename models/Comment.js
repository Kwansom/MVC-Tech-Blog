const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const User = require("./user");
const Post = require("./Post");

class Comment extends Model {}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Post,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "comment",
  }
);

module.exports = Comment;
