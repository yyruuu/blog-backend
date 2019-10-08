const router = require('koa-router')();
const { Article, Sequelize, Tag } = require('../../model');

router.prefix('/tag');

router.get('/', async ctx => {
  let tags = await Tag.findAll();
  ctx.body = {
    err: 0,
    info: null,
    data: tags
  }
})

router.get('/:id', async ctx => {
  let { id } = ctx.params;
  let tag = await Tag.findOne({ where: { id } });
  if (!tag) {
    ctx.body = {
      err: 1,
      info: 'tag is not exists'
    }
  }else{
    let articles = await tag.getArticles();
    ctx.body = {
      err: 0, 
      info: null,
      data: articles
    }
  }
})

router.post('/', async ctx => {
  let { name, desc } = ctx.request.body;
  let tag;
  try {
    tag = await Tag.create({ name, desc });
  } catch (e) {
    ctx.body = {
      err: 1,
      info: 'tag is already exists!'
    }
    return;
  }
  ctx.body = {
    err: 0,
    info: null,
    data: tag
  }
})


module.exports = router;