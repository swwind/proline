import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as mount from 'koa-mount';
import * as logger from 'koa-logger';
import * as bodyRouter from 'koa-bodyparser';
import * as Posts from '../posts/Posts';
import * as Channels from '../posts/Channels';
import * as Files from '../posts/Files';
import { key2string } from '../encrypt';

const api = new Koa();
const router = new Router();

// =================== GET ===================

// 询问频道内文章列表
// - cid
router.get('/postlist', async (ctx) => {
  if (!ctx.query.cid) {
    return ctx.end(400, 'BAD REQUEST');
  }
  const result = await Channels.getPostList(ctx.query.cid, 'offline');
  if (result) {
    ctx.end(200, result);
  } else {
    ctx.end(404, 'NOT FOUND');
  }
});

// 获取文章内容
// - cid
// - pid
router.get('/postinfo', async (ctx) => {
  if (!ctx.query.cid || !ctx.query.pid) {
    return ctx.end(400, 'BAD REQUEST');
  }
  const result = await Posts.getPostInfo(ctx.query.cid, ctx.query.pid, 'offline');
  if (result) {
    ctx.end(200, result);
  } else {
    ctx.end(404, 'NOT FOUND');
  }
});

// 获取文件信息（种子）
// - cid
// - fid
router.get('/fileinfo', async (ctx) => {
  if (!ctx.query.cid || !ctx.query.fid) {
    return ctx.end(400, 'BAD REQUEST');
  }
  const result = await Files.getFileInfo(ctx.query.cid, ctx.query.fid, 'offline');
  if (result) {
    ctx.end(200, result);
  } else {
    ctx.end(404, 'NOT FOUND');
  }
});

// 是否拥有文件可供下载
// - cid
// - fid
router.get('/hasfile', async (ctx) => {
  if (!ctx.query.cid || !ctx.query.fid) {
    return ctx.end(400, 'BAD REQUEST');
  }
  const result = await Files.hasFile(ctx.query.cid, ctx.query.fid);
  if (result) {
    ctx.end(200, 'OK');
  } else {
    ctx.end(404, 'NOT FOUND');
  }
});

// 获取文件片段
// - cid
// - fid
// - index
router.get('/filepiece', async (ctx) => {
  if (!ctx.query.cid || !ctx.query.fid || !ctx.query.index) {
    return ctx.end(400, 'BAD REQUEST');
  }

  if (!await Files.hasFile(ctx.query.cid, ctx.query.fid)) {
    return ctx.end(404, 'FILE NOT FOUND');
  }

  const buffer = await Files.getFilePiece(ctx.query.cid, ctx.query.fid, Number(ctx.query.index));
  ctx.end(200, buffer);
});

// 获取公钥
// - cid
router.get('/publickey', async (ctx) => {
  if (!ctx.query.cid) {
    return ctx.end(400, 'BAD REQUEST');
  }
  const result = await Channels.getPublicKey(ctx.query.cid, 'offline');
  if (result) {
    ctx.end(200, key2string(result));
  } else {
    ctx.end(404, 'NOT FOUND');
  }
});

// ================= POST =================

// 发送消息
// - message
router.post('/message', async (ctx) => {
  const body = ctx.request.body;
  if (!body.message) {
    return ctx.end(400, 'BAD REQUEST');
  }
  /* eslint-disable-next-line no-console */
  console.log(`recv: ${body.message}`);
  ctx.end(200, 'OK');
});

// 主动推送文章更新
// - cid
// - post
router.post('/pushpost', async (ctx) => {
  const body = ctx.request.body;
  if (!body.cid || !body.post) {
    return ctx.end(400, 'BAD REQUEST');
  }
  if (!Channels.subscribed(body.cid)) {
    return ctx.end(400, 'NOT SUBSCRIBED');
  }
  try {
    Posts.addPost(body.cid, body.post);
  } catch (e) {
    ctx.end(400, e.message.toUpperCase());
  }
  ctx.end(200, 'OK');
});

api.use(async (ctx, next) => {
  ctx.end = (status: number, msg: string) => {
    ctx.response.status = status;
    ctx.response.body = msg;
  };
  await next();
});
api.use(bodyRouter());
api.use(router.routes());
api.use(router.allowedMethods());

const app = new Koa();
app.use(logger());
app.use(mount('/api/v1', api));

export default app;
