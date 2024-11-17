const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection"); // Importing db connection
const User = require("./user");

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contents: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Post",
  }
);

Post.belongsTo(User),
  {
    foreignKey: "userId",
  };
