const getAll = async (pool, includePrivate, page) => {
  const q = 'SELECT aid, published, name FROM articles';
  const { rows } = await pool.query(q);
  return rows;
};

const getVersions = async (pool, aid) => {
  const { rows } = await pool.query(`
    SELECT delta FROM versions WHERE aid = $1 ORDER BY ordinal
  `, [aid]);
  return rows;
};

const insertArticle = async (pool, aid, isPublic, name, description) => {
  await pool.query(`
    INSERT INTO articles (aid, is_public, name, description)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (aid)
    DO UPDATE SET is_public = $2, name = $3, description = $4
  `, [aid, isPublic, name, description])
};

const insertVersion = async (pool, aid, reason, delta, ordinal) => {
  await pool.query(`
    INSERT INTO versions (aid, ordinal, uid, reason, delta)
    VALUES ($1, $2, $3, $4, $5)
  `, [aid, ordinal, 1, reason, delta])
};

module.exports = {
  getAll,
  getVersions,
  insertArticle,
  insertVersion,
};
