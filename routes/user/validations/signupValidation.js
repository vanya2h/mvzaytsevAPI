import joi from "joi";
import { User } from "@models/User";

export const signupValidation = {
  name: {
    custom: {
      options: value => {
        joi.attempt(
          value,
          joi.string().required(),
          new Error("Поле 'Отображаемое имя' не заполнено")
        );

        joi.attempt(
          value,
          joi
            .string()
            .min(6)
            .max(20),
          new Error("Отображаемое имя должно быть не меньше 6 и не больше 20 символов")
        );

        return true;
      }
    }
  },
  description: {
    custom: {
      options: value => {
        if (!value) {
          return true;
        }

        joi.attempt(
          value,
          joi
            .string()
            .min(6)
            .max(32),
          new Error("'Род деятельности' не должен быть меньше 6 или больше 32 символов")
        );

        return true;
      }
    }
  },
  password: {
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.passwordRepeat) {
          throw new Error("Пароли не совпадают");
        }

        joi.attempt(value, joi.string().required(), new Error("Поле 'Пароль' не заполнено"));

        joi.attempt(
          value,
          joi
            .string()
            .min(6)
            .max(32),
          new Error("'Пароль' должен быть не меньше 6 и не больше 32 символов")
        );

        return true;
      }
    }
  },
  email: {
    custom: {
      options: async value => {
        joi.attempt(value, joi.string().required(), new Error("Не заполнено поле 'E-mail'"));
        joi.attempt(value, joi.string().email(), new Error("E-mail указан некорректно"));

        const existingUser = await User.findOne({
          email: value,
          emailConfirmed: true
        });

        if (existingUser) {
          throw new Error("Пользователь с таким E-mail'ом уже зарегистрирован, возможно это вы");
        }

        return true;
      }
    }
  }
};

export default signupValidation;
