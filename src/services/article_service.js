const DiffMatchPatch = require('diff-match-patch');
const Dao = require('./article_dao');

const getAll = async (pool, includePrivate, page) => {
  const rows = await Dao.getAll(pool, includePrivate, page);
  return rows;
};

const getContent = async (pool, aid) => {
  const dmp = new DiffMatchPatch();
  const rows = await Dao.getVersions(pool, aid);
  return rows
    .map((r) => r.delta)
    .reduce((accStr, currentDelta) => {
      const diffs = dmp.diff_fromDelta(accStr, currentDelta);
      return dmp.diff_text2(diffs);
    }, '');
};

const save = async (pool, aid, reason, content, basedOn) => {
  let previousContent;
  if (basedOn == -1) {
    previousContent = '';
  } else {
    previousContent = await getContent(pool, aid);
  }
  const dmp = new DiffMatchPatch();
  const diffs = dmp.diff_main(previousContent, content);
  const delta = dmp.diff_toDelta(diffs);

  const name = 'TODO: name of the article';
  const description = 'TODO: description';
  const isPublic = true;

  await Dao.insertArticle(pool, aid, isPublic, name, description);
  await Dao.insertVersion(pool, aid, reason, delta, basedOn);
};

module.exports = {
  getAll,
  getContent,
  save,
};
