const Router = require('koa-router');

const router = new Router({
  prefix: '/api/articles'
});

router.get('/list', (ctx, next) => {
  ctx.body = [
    {
      'slug': 'Naissance-du-blog',
      'name': 'Naissance du blog',
      'published': '2022-07-09',
    },
    {
      'slug': 'La-plus-belle-équation',
      'name': 'La plus belle équation',
      'published': '2022-07-10',
    },
  ];
});

router.get('/:slug', (ctx, next) => {
  ctx.body = {
    'slug': ctx.params.slug,
    'name': 'To be done',
    'content': '<p>Paragraph 1</p><p>Paragraph 2</p><p>Etc.</p>',
  };
});

module.exports = router
