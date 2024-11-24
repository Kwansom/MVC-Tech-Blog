const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcryptjs");

class User extends Model {
  // This method compares the password entered by the user with the hashed pw stored in db
  checkPassword(password) {
    return bcrypt.compareSync(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "user",
  }
);

// Before creating a new user, hash their password using bcrypt
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

module.exports = User;
