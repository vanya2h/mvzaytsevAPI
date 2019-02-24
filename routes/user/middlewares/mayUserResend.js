import joi from "joi";
import moment from "moment";
import { User } from "@models/User";
import { createError } from "@utils/index";

export const mayUserResend = async (req, _, next) => {
  const email = req.query.email;

  if (!joi.validate(email, joi.string().email())) {
    return next(createError("Неверный формат E-mail'а"));
  }

  const user = await User.findOne({
    email
  });

  if (!user) {
    return next(createError("Не удалось найти пользователя в бд"));
  }

  if (moment().diff(moment(user.emailSendedAt), "seconds") < 60) {
    return next(createError("Вы не можете отправлять E-mail чаще, чем 1 раз в 60 секунд"));
  }

  return next();
};

export default mayUserResend;
