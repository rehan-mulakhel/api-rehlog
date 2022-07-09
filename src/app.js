const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const articles = require('./controllers');

app.use(articles.routes());
app.listen(8000);
