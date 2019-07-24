// 前段与后端的数据交换点

import Koa from 'koa';
import Router from 'koa-router';
import { Posts, server } from '../core';
import logger from 'koa-logger';

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
    ctx.response.status = 404;
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
    ctx.response.status = 404;
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use(logger());
}

app.use(router.routes());
app.use(router.allowedMethods());
// 本地端口
app.listen(15884);
// 开放端口
server.listen(23333);

export default true;
