import express from "express";
import { checkSchema } from "express-validator/check";
import { createError } from "@utils/createError";
import { resolveEntityId } from "@utils/resolveEntityId";
import { auth } from "@middlewares/auth";
import { createToken } from "@utils/createToken";
import { hashWithSecret } from "@utils/hashWithSecret";
import { handleValidation } from "@middlewares/handleValidation";
import { verifySomethingWithHashed } from "@utils/verifySomethingWithHashed";
import { User } from "@models/User";
import { signinValidation } from "./signinValidation";
import { signupValidation } from "./signupValidation";

const router = express.Router();

router.post(
  "/signin",
  [checkSchema(signinValidation), handleValidation],
  async (req, res, next) => {
    const { login, password } = req.matchedData;

    const criteria = {
      login
    };

    try {
      const user = await User.findOne(criteria, "+password");

      if (!user) {
        return next(createError("Не удалось найти пользователя в бд"));
      }

      const isVerified = await verifySomethingWithHashed(password, user.password);

      if (!isVerified) {
        return next(createError("Неверный логин или пароль"));
      }

      const userId = resolveEntityId(user);
      const populatedUser = await User.findById(userId);

      const token = await createToken({
        userId
      });

      return res.json({
        token,
        user: populatedUser
      });
    } catch (reason) {
      console.error("Ошибка", reason);
      return next(
        createError("В данный момент невозможно совершить авторизацию. Попробуйте позже", reason)
      );
    }
  }
);

if (process.env.NODE_ENV === "development") {
  router.post(
    "/signup",
    [checkSchema(signupValidation), handleValidation],
    async (req, res, next) => {
      const { matchedData } = req;

      try {
        const hashedPassword = await hashWithSecret(matchedData.password);

        const createdUser = await User.create({
          ...matchedData,
          password: hashedPassword
        });

        const token = await createToken({
          userId: resolveEntityId(createdUser)
        });

        return res.json({
          token,
          user: createdUser
        });
      } catch (reason) {
        console.error("Ошибка", reason);
        return next(
          createError("В данный момент невозможно совершить авторизацию. Попробуйте позже", reason)
        );
      }
    }
  );
}

router.get("/auth", [auth()], async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return next(createError("Пользователь не найден в бд"));
    }

    return res.json(user);
  } catch (error) {
    console.error("Ошибка", error);
    return next(createError("Не удается провести авторизацию. Обратитесь в тех. поддержку", error));
  }
});

export const user = router;
export default user;
