const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const router = require('koa-router')();
const { Article, Sequelize, Tag, User } = require('../../model');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);
const Op = Sequelize.Op;

router.prefix('/article');

//const clean = DOMPurify.sanitize(dirty);

router.get('/', async ctx => {
  let { sort = [], offset = 0, pageSize = 10, filter = {} } = ctx.request.query;
  if (typeof sort == 'string') {
    sort = JSON.parse(sort);
  }
  if (typeof filter == 'string') {
    filter = JSON.parse(filter);
  }
  const res = await Article.findAll({
    include: [{ model: Tag }, { model: User, attributes: ['username'] }],
    order: sort.length == 0 ? null : [sort],
    offset: +offset,
    limit: +pageSize,
    where: (filter == null) ? {
      createdAt: {
        [Op.gte]: filter.startDate,
        [Op.lt]: filter.endDate
      }
    } : {},
  });
  //直接获得Article表里有多少条数据
  let total = await Article.count();
  let nextPage = ((+offset + +pageSize) >= total) ? null : (+offset + +pageSize);
  ctx.body = {
    err: 0,
    info: null,
    pageNation: {
      total,
      count: res.length,
      offset: +offset,
      nextPage: nextPage,
      pageSize: +pageSize
    },
    data: res.map(i => {
      i.content = DOMPurify.sanitize(i.content);
      return i;
    })
  }
})

router.post('/', async ctx => {
  //解构语句赋值
  let { title, target, content } = ctx.request.body;
  let userId = ctx.session.userId;
  console.log("cookie", ctx.session);
  console.log("userId", userId);
  let article = await Article.create({ title, target, content, userId });
  ctx.body = {
    err: 0,
    info: null,
    data: article
  }
})

router.put('/:id', async ctx => {
  let article = await Article.findOne({ where: { id: ctx.params.id, include: [{ model: User, attributes: ['username'] }] } });
  if (article) {
    let { title, target, content } = ctx.request.body;
    article.title = title;
    article.target = target;
    article.content = content;
    article.save();
    article.content = DOMPurify.sanitize(article.content);
    ctx.body = {
      err: 0,
      info: null,
      data: article
    }
  } else {
    ctx.body = {
      err: 1,
      info: "未找到该文章"
    }
  }
})

router.get('/:id', async ctx => {
  let article = await Article.findOne({ where: { id: ctx.params.id }, include: [{ model: Tag }, { model: User, attributes: ['username'] }] });
  if (article) {
    article.clickTimes++;
    await article.save();
    ctx.body = {
      err: 0,
      info: null,
      data: article
    }
  } else {
    ctx.body = {
      err: 1,
      info: "未找到该文章"
    }
  }
})

router.delete('/:id', async ctx => {
  let article = await Article.findOne({ where: { id: ctx.params.id } });
  if (article) {
    await article.destroy();
  }
  ctx.body = {
    err: 0,
    info: null,
    data: article
  }
})

module.exports = router;