import joi from "joi";
import { User } from "@models/User";
import { verifySomethingWithHashed } from "@utils/verifySomethingWithHashed";

export const signinValidation = {
  email: {
    custom: {
      options: async value => {
        joi.attempt(value, joi.string().required(), new Error("Поле 'E-mail' не заполнено"));

        const user = await User.findOne({
          email: value
        });

        if (!user) {
          throw new Error("Такой E-mail у нас не зарегистрирован");
        }

        return true;
      }
    }
  },
  password: {
    custom: {
      options: async (value, { req }) => {
        joi.attempt(value, joi.string().required(), new Error("Поле 'Пароль' не заполнено"));

        const user = await User.findOne(
          {
            email: req.body.email
          },
          "+password"
        );

        const isVerified = await verifySomethingWithHashed(value, user.password);

        if (!isVerified) {
          throw new Error("Неверный пароль от аккаунта");
        }
      }
    }
  }
};

export default signinValidation;
