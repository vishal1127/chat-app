const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const ArchivedChats = sequelize.define("archiveChat", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  from: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = ArchivedChats;
