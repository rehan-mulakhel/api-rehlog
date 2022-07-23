const DiffMatchPatch = require('diff-match-patch');
const matter = require('gray-matter');
const Dao = require('./article_dao');

const extractMarkdown = (markdown) => {
  const matterResult = matter(markdown);
  return {
    name: matterResult.data.name,
    description: matterResult.data.description,
    isPublic: matterResult.data.public == 'true',
    content: matterResult.content,
  };
};

const getAll = async (pool, includePrivate, page) => {
  const rows = await Dao.getAll(pool, includePrivate, page);
  return rows;
};

const getArticle = async (pool, aid) => {
  const markdown = await getContent(pool, aid);
  const { name, content } = extractMarkdown(markdown);
  return { name, content };
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

const save = async (pool, aid, reason, content, ordinal) => {
  const previousContent = ordinal == 0 ? '' : await getContent(pool, aid);
  const dmp = new DiffMatchPatch();
  const diffs = dmp.diff_main(previousContent, content);
  const delta = dmp.diff_toDelta(diffs);

  const { name, description, isPublic } = extractMarkdown(content);
  await Dao.insertArticle(pool, aid, isPublic, name, description);
  await Dao.insertVersion(pool, aid, reason, delta, ordinal);
};

module.exports = {
  getAll,
  getArticle,
  save,
};
