import { createError } from "@utils/createError";
import { isCelebrate } from "celebrate";

// eslint-disable-next-line
export const errorHandler = (err, req, res, next) => {
  console.log(err);

  let finalError = err;

  if (isCelebrate(err)) {
    return res.status(422).json(err);
  }

  if (err instanceof Error) {
    finalError = createError("Неизвестная ошибка сервера. Попробуйте позже", err);
  }

  return res
    .status(500)
    .json(finalError || createError("Неизвестная ошибка сервера. Попробуйте позже"));
};

export default errorHandler;
