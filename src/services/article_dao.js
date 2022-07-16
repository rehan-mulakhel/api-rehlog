const createArticle = async (pool, aid, isPublic, name, desc, delta) => {
  await pool.query(`
    INSERT INTO articles (aid, is_public, name, description)
    VALUES ($1, $2, $3, $4)
  `, [aid, isPublic, name, desc])
  await pool.query(`
    INSERT INTO versions (aid, based_on, uid, reason, diff)
    VALUES ($1, $2, $3, $4, $5)
  `, [aid, 0, 1, 'Init', delta])
};

const getArticles = async (pool) => {
  const q = 'SELECT aid, published, name FROM articles';
  const { rows } = await pool.query(q);
  return rows;
};

module.exports = {
  createArticle,
  getArticles,
};
