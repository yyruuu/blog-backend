const Sequelize = require('sequelize');
module.exports = {
  Sequelize,
  sequelize: new Sequelize('blog', 'root', '888888', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  })
}
