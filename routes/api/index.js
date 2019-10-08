const router = require('koa-router')();
const articleRouter = require('./article');
const usersRouter = require('./users');
const lastestArticle = require('./lastestArticle');
const achieves = require('./achieves');
const tag = require('./tag');
const { User } = require('../../model/index');
router.prefix('/api');

//权限管理
// router.use(async (ctx, next) => {
//   let { method, url } = ctx.request;
//   const userId = ctx.session.userId || 1;
//   let user = await User.findOne({
//     where: {
//       id: userId
//     }
//   });
//   let permissions = await user.getPermissions();
//   console.log("perimissions,", permissions);
//   if (permissions.some(i => {
//     return i.method == method && new RegExp(i.path).test(url);
//   })) {
//     await next();
//   } else {
//     ctx.body = {
//       err: 1,
//       info: '无权限'
//     }
//   }
// })

router.use(articleRouter.routes(), articleRouter.allowedMethods())
router.use(usersRouter.routes(), usersRouter.allowedMethods())
router.use(lastestArticle.routes(), lastestArticle.allowedMethods())
router.use(achieves.routes(), achieves.allowedMethods())
router.use(tag.routes(), tag.allowedMethods())





module.exports = router;