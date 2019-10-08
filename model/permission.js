const {Sequelize,sequelize} = require('./base');

let Permission = sequelize.define("permission", {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  path: {
    type: Sequelize.STRING
  },
  method: {
    type: Sequelize.STRING,
  }
})

module.exports = Permission;