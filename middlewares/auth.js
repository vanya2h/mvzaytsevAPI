import { User } from "@models/User";
import { verifyToken, createError } from "@utils";

export const auth = (required = true) => (req, _, next) => {
  const token = req.headers.authorization;

  if (token) {
    return verifyToken(token)
      .then(decoded => {
        req.userId = decoded.userId;

        return User.findById(req.userId)
          .then(user => {
            if (!user && required) {
              return next(createError("Пользователь не найден в базе данных"));
            }
            req.user = user;
            req.isAdmin = user.isAdmin;
            return next();
          })
          .catch(error =>
            (required
              ? next(createError("Токен не действителен, попробуйте авторизоваться заново", error))
              : next())
          );
      })
      .catch(error =>
        (required
          ? next(createError("В данный момент не удается совершить операцию", error))
          : next())
      );
  }

  if (required) {
    return next(createError("Сперва вы должны авторизоваться"));
  }
  return next();
};

export default auth;
