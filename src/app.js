const Koa = require('koa');
const koaBody = require('koa-body');
const { Pool } = require('pg');
const Router = require('koa-router');
const app = new Koa();
const articles = require('./controllers');

app.pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

app.use(koaBody());
app.use(articles.routes());
app.listen(8000);
