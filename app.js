const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session')
const index = require('./routes/index')
const apiRouter = require('./routes/api/index')
const cors = require('koa2-cors');


// error handler
onerror(app)
app.keys = ['blog'];
// middlewares
app.use(cors({
  credentials: true, //是否允许发送Cookie
}));
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(session({
  key: "blog:koa:sess",
  maxAge: 86400000
}, app));

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
//app.use(index.routes(), index.allowedMethods())
//app.use(users.routes(), users.allowedMethods())
app.use(apiRouter.routes(), apiRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
