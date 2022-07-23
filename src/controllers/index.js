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
  await ArticleService.save(pool, aid, reason, content, 0);
  ctx.body = { 'status': 'Success', 'message': aid };
});

router.get('/list', async (ctx, next) => {
  const rows = await ArticleService.getAll(ctx.app.pool, false, 1);
  ctx.body = rows;
});

router.get('/:aid', async (ctx, next) => {
  const article = await ArticleService.getArticle(ctx.app.pool, ctx.params.aid);
  ctx.body = {
    'name': article.name,
    'description': article.description,
    'content': article.content,
  };
});

router.post('/:aid/edit', async (ctx, next) => {
  const pool = ctx.app.pool;
  const aid = ctx.params.aid;
  const { ordinal, reason, content } = ctx.request.body;
  const delta = content;
  await ArticleService.save(pool, aid, reason, content, +ordinal);
  ctx.body = { 'status': 'Success'};
});

module.exports = router
