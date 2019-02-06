import { validationResult } from "express-validator/check";
import { matchedData } from "express-validator/filter";

export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.mapped()
    });
  }

  req.matchedData = matchedData(req);
  return next();
};

export default handleValidation;
