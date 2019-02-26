export const createFindOptions = (req, _, next) => {
  req.findOptions = {
    skip: +req.query.skip || 0,
    limit: +req.query.limit || 10,
    sort: {
      createdAt: -1
    }
  };

  return next();
};
