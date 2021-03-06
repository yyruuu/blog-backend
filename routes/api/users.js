const router = require('koa-router')()
const { User } = require('../../model')

router.prefix('/users')

// router.get('/login-success', async ctx => {
//   let uid = ctx.session.userId;
//   let user = await User.findOne({ where: { id: uid } });
//   c
// })

router.get('/login', async ctx => {
  console.log("session id", ctx.session);
  if (ctx.session.userId) {
    let user = await User.findOne({ where: { id: ctx.session.userId } });
    console.log("session user:", user);
    if (user) {
      ctx.body = {
        err: 0,
        info: null,
        data: user
      }
    }
  }else{
    ctx.body = {
      err: 1,
      info: 'signout'
    }
  }
})

router.get('/signout', async ctx => {
  ctx.session = null;
  ctx.body = {
    err: 0,
    info: '注销成功'
  }
})


router.put('/:id', async ctx => {
  let { id } = ctx.params;
  let user = await User.findOne({ where: { id } });
  if (user) {
    let { username, email } = ctx.request.body;
    user.username = username;
    user.email = email;
    user.save();
    ctx.body = {
      err: 0,
      info: null,
      data: user
    }
  } else {
    ctx.body = {
      err: 1,
      info: 'user is not exists'
    }
  }
})

router.get('/:id', async ctx => {
  let { id } = ctx.params;
  let user = await User.findOne({ where: { id } });
  user = JSON.parse(JSON.stringify(user));
    delete user.password;
  if (user) {
    ctx.body = {
      err: 0,
      info: null,
      data: user
    }
  } else {
    ctx.body = {
      err: 1,
      info: "user is not exists"
    }
  }
})

router.post('/login', async ctx => {
  let { username, password } = ctx.request.body;
  let user = await User.findOne({ where: { username } });
  if (!user || user.password !== password) {
    let info = "";
    if (!user) {
      info = "用户不存在！";
    } else {
      info = "用户名或密码错误！";
    }
    ctx.body = {
      err: 1,
      info: info
    }
  } else {
    user = JSON.parse(JSON.stringify(user));
    delete user.password;
    ctx.body = {
      err: 0,
      info: "登陆成功",
      data: user
    }
  }

  info = "登陆成功";
  ctx.session.userId = user.id;
})

router.post('/register', async ctx => {
  let user = await User.create(ctx.request.body);
  user = JSON.parse(JSON.stringify(user));
  delete user.password;
  ctx.body = {
    err: 0,
    info: "注册成功！",
    data: user
  }
})


router.delete('/:id', async ctx => {
  let { id } = ctx.params;
  let user = await User.findOne({ where: { id } });
  if(user){
    await user.destroy();
    ctx.body = {
      err: 0,
      info: null,
      data: user
    }
  }else{
    ctx.body = {
      err: 1,
      info: "删除失败"
    }
  }
})

router.get('/', async ctx => {
  let users = await User.findAll();
  users = users.map(i => {
    i = JSON.parse(JSON.stringify(i));
    delete i.password;
    return i;
  })
  ctx.body = {
    err: 0,
    info: null,
    data: users
  }
})
module.exports = router
