export const parseQuery = (req, _, next) => {
  const query = {};

  if (req.query.postId) {
    query.post = req.query.postId;
  }

  req.parsedQuery = query;
  return next();
};

export default parseQuery;
