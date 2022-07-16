const Router = require('koa-router');
const crypto = require('crypto');
const { createArticle, getArticles } = require('../services/article_dao');

const router = new Router({
  prefix: '/api/articles'
});

router.post('/create', async (ctx, next) => {
  const pool = ctx.app.pool;
  const aid = crypto.randomUUID();
  const { name, description, is_public: isPublic } = ctx.request.body;
  const delta = 'TODO delta';
  await createArticle(pool, aid, isPublic, name, description, delta);
  ctx.body = { 'status': 'Success'};
});

router.get('/list', async (ctx, next) => {
  const rows = await getArticles(ctx.app.pool);
  ctx.body = rows;
});

router.get('/:slug', (ctx, next) => {
  ctx.body = {
    'slug': ctx.params.slug,
    'name': 'To be done',
    'content': '<p>Paragraph 1</p><p>Paragraph 2</p><p>Etc.</p>',
  };
});

module.exports = router
