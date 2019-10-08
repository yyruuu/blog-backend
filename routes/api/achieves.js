const router = require('koa-router')();
const {sequelize, Article} = require('../../model');
router.prefix('/achieves');

router.get('/', async ctx => {
  let articles = Article.findAll({
    order: [["createdAt", "desc"]]
  });
  let res = await sequelize.query(
    `select 
    date_format(createdAt, '%Y-%m') as date, count(*) as articleCount
    from 
    articles
    group by
    date_format(createdAt, '%Y-%m')
    `
  ,{type: sequelize.QueryTypes.SELECT});
  ctx.body = {
    err: 0,
    info: null,
    data: res.map(i => {
      let arr = i.date.split("-");
      i.year = +arr[0];
      i.month = +arr[1];
      return i;
    })
  }
})



module.exports = router;
