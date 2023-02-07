const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const UserGroup = sequelize.define("userGroup", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  admin: {
    type: Sequelize.UUID,
    allowNull: false,
  },
});

module.exports = UserGroup;
