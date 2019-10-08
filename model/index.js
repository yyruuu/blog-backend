const User = require('./user');
const Article = require('./article');
const Tag = require('./tag');
const Tagging = require('./tagging');
const Permission = require('./permission');
const UserPermission = require('./userpermission');
const {Sequelize,sequelize} = require('./base');

User.hasMany(Article);
Article.belongsTo(User);

//创建一个新模型tagging
Article.belongsToMany(Tag, {through: Tagging});
Tag.belongsToMany(Article, {through: Tagging});

Permission.belongsToMany(User, {through: UserPermission});
User.belongsToMany(Permission, {through: UserPermission});

User.sync();
Permission.sync();
Article.sync({alter: true});
Tagging.sync();
Tag.sync();
UserPermission.sync();

module.exports = {
  User, Article, Tag, Tagging,Permission, Sequelize, sequelize
}