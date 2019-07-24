import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as mount from 'koa-mount';
import * as logger from 'koa-logger';
import * as bodyRouter from 'koa-bodyparser';
import Posts from '../posts/Posts';
import { key2string, verifyPostInfo } from '../encrypt';

const api = new Koa();
const router = new Router();

// 询问拥有的以及正在下载的文件列表
router.get('/filelist', async (ctx) => {
  ctx.response.status = 200;
  // FIXME: 在这里获取文件列表
  ctx.response.body = [];
});

// 询问频道内文章列表
// - cid
router.get('/postlist', async (ctx) => {
  if (!ctx.query.cid) {
    return ctx.throw(400); // BAD REQUEST
  }
  const result = await Posts.getPostList(ctx.query.cid, 'local-only');
  if (result) {
    ctx.response.status = 200;
    ctx.response.body = result;
  } else {
    ctx.throw(404); // NOT FOUND
  }
});

// 获取文章内容
// - cid
// - pid
router.get('/postinfo', async (ctx) => {
  if (!ctx.query.cid || !ctx.query.pid) {
    return ctx.throw(400); // BAD REQUEST
  }
  const result = await Posts.getPostInfo(ctx.query.cid, ctx.query.pid, 'local-only');
  if (result) {
    ctx.response.status = 200;
    ctx.response.body = result;
  } else {
    ctx.throw(404); // NOT FOUND
  }
});

// 获取文件片段
// - cid
// - fid
// - index
router.get('/filepiece', async (ctx) => {
  ctx.throw(501);
});

// 获取公钥
// - cid
router.get('/publickey', async (ctx) => {
  if (!ctx.query.cid) {
    return ctx.throw(400); // BAD REQUEST
  }
  const result = await Posts.getPublicKey(ctx.query.cid, 'local-only');
  if (result) {
    ctx.response.status = 200;
    ctx.response.body = key2string(result);
  } else {
    ctx.throw(404); // NOT FOUND
  }
});

// 发送消息
// - message
router.post('/message', async (ctx) => {
  if (!ctx.request.body.message) {
    return ctx.throw(400); // BAD REQUEST
  }
  /* eslint-disable-next-line no-console */
  console.log(`recv: ${ctx.request.body.message}`);
  ctx.response.status = 200;
});

// 主动推送文章更新
// - cid
// - post
router.post('/pushpost', async (ctx) => {
  const body = ctx.request.body;
  if (!body.cid || !body.post) {
    return ctx.throw(400); // BAD REQUEST
  }

  if (!Posts.isSubscribed(body.cid)) {
    return ctx.throw(400); // NOT SUBSCRIBED
  }

  const publickey = await Posts.getPublicKey(body.cid);
  if (!publickey || !verifyPostInfo(publickey, body.post)) {
    return ctx.throw(400); // FAKE POST
  }

  ctx.response.status = 200;
  Posts.addPost(body.cid, body.post);
});

api.use(bodyRouter());
api.use(router.routes());
api.use(router.allowedMethods());

const app = new Koa();
app.use(logger());
app.use(mount('/api/v1', api));

export default app;
