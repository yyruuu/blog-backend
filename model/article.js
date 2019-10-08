const {Sequelize,sequelize} = require('./base');

let Article = sequelize.define("article", {
  id: {
    primaryKey: true,
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  clickTimes: {
    type: Sequelize.STRING,
    defaultValue: 0
  },
  content: {
    type: Sequelize.TEXT,
  },
  // author: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     model: User,
  //     key: "id"
  //   }
  // }
})



module.exports = Article;