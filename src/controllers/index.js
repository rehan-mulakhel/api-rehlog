const Router = require('koa-router');
const crypto = require('crypto');
const ArticleService = require('../services/article_service');

const router = new Router({
  prefix: '/api/articles'
});

router.post('/create', async (ctx, next) => {
  const pool = ctx.app.pool;
  const aid = crypto.randomUUID();
  const { content } = ctx.request.body;
  const reason = 'Init commit';
  await ArticleService.save(pool, aid, reason, content, -1);
  ctx.body = { 'status': 'Success', 'message': aid };
});

router.get('/list', async (ctx, next) => {
  const rows = await ArticleService.getAll(ctx.app.pool, false, 1);
  ctx.body = rows;
});

router.get('/:aid', async (ctx, next) => {
  const content = await ArticleService.getContent(ctx.app.pool, ctx.params.aid);
  ctx.body = {
    'name': 'To be done',
    'content': content,
  };
});

router.post('/:aid/edit', async (ctx, next) => {
  const pool = ctx.app.pool;
  const aid = ctx.params.aid;
  const { based_on: basedOn, reason, content } = ctx.request.body;
  const delta = content;
  await ArticleService.save(pool, aid, reason, content, +basedOn);
  ctx.body = { 'status': 'Success'};
});

module.exports = router
