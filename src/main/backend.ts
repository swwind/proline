// 前段与后端的数据交换点

import Koa from 'koa';
import Router from 'koa-router';
import { Posts, server, Encrypt } from '../core';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import { key2string } from '../core/encrypt';

const app = new Koa();
const router = new Router();

// 订阅新的频道
router.get('/subscribe', async (ctx) => {
  const { cid } = ctx.query;
  const error = await Posts.subscribe(cid);
  if (error) {
    ctx.response.status = 500;
    ctx.response.body = error;
  } else {
    ctx.response.status = 200;
  }
});

// 取消订阅
router.get('/unsubscribe', async (ctx) => {
  const { cid } = ctx.query;
  await Posts.unsubscribe(cid);
  ctx.response.status = 200;
});

// 获得订阅列表
router.get('/sublist', (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = Posts.subscribedList();
});

// 获取文章列表
router.get('/postlist', async (ctx) => {
  const { cid } = ctx.query;
  const result = await Posts.getPostList(cid);
  if (result) {
    ctx.response.status = 200;
    ctx.response.body = result;
  } else {
    return ctx.throw(404);
  }
});

// 获取文章内容
router.get('/postinfo', async (ctx) => {
  const { cid, pid } = ctx.query;
  const result = await Posts.getPostInfo(cid, pid);
  if (result) {
    ctx.response.status = 200;
    ctx.response.body = result;
  } else {
    return ctx.throw(404);
  }
});

// 生成随机频道秘钥
router.get('/generatekey', async (ctx) => {
  const result = await Encrypt.generateKeyPair();

  ctx.response.status = 200;
  ctx.response.body = {
    publicKey: key2string(result.publicKey),
    privateKey: key2string(result.privateKey),
  };
});

// 注册新频道
router.post('/regester-publickey', async (ctx) => {
  const { publicKey } = ctx.request.body;

  Posts.registerPublicKey(publicKey);

  ctx.response.status = 200;
});

// 签名文章
router.post('/signpost', async (ctx) => {
  const { post, privateKey } = ctx.request.body;

  post.signature = Encrypt.signPostInfo(Encrypt.string2prvkey(privateKey), post);

  ctx.response.status = 200;
  ctx.response.body = post;
});

// 发布文章
router.post('/publish', async (ctx) => {
  const { post, cid } = ctx.request.body;
  Posts.addPost(cid, post);

  ctx.response.status = 200;
});

app.use(async (ctx, next) => {
  if (ctx.ip === '::1') {
    await next();
  } else {
    ctx.throw(403);
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(logger());
}

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  await next();
});
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());
// 本地端口
app.listen(15884);
// 开放端口
server.listen(15468);

export default true;
