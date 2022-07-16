const Koa = require('koa');
const koaBody = require('koa-body');
const { Pool } = require('pg');
const Router = require('koa-router');
const app = new Koa();
const articles = require('./controllers');

app.pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'rehlog',
  password: 'postgres',
  port: 5432,
});

app.use(koaBody());
app.use(articles.routes());
app.listen(8000);
