const {Sequelize,sequelize} = require('./base');

const Article = require('./article');
const Tag = sequelize.define('tag',{
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  desc: {
    type: Sequelize.STRING
  }
});

module.exports = Tag;