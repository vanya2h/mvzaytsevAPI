import express from "express";
import { checkSchema } from "express-validator/check";
import { createError } from "@utils/createError";
import { resolveEntityId } from "@utils/resolveEntityId";
import { auth } from "@middlewares/auth";
import { makeSecret } from "@utils/makeSecret";
import { createToken } from "@utils/createToken";
import { hashWithSecret } from "@utils/hashWithSecret";
import { handleValidation } from "@middlewares/handleValidation";
import { User } from "@models/User";
import { verifySomethingWithHashed } from "@utils/index";
import { signinValidation } from "./validations/signinValidation";
import { signupValidation } from "./validations/signupValidation";
import { mayUserResend } from "./middlewares/mayUserResend";
import { sendConfirmationEmail } from "./utils/sendConfirmationEmail";

const router = express.Router();

router.post(
  "/signin",
  [checkSchema(signinValidation), handleValidation],
  async (req, res, next) => {
    try {
      const email = req.matchedData.email;

      const user = await User.findOne({
        email
      });

      const token = await createToken({
        userId: resolveEntityId(user)
      });

      return res.json({
        token,
        user
      });
    } catch (reason) {
      return next(
        createError("В данный момент невозможно совершить авторизацию. Попробуйте позже", reason)
      );
    }
  }
);

router.post(
  "/signup",
  [checkSchema(signupValidation), handleValidation],
  async (req, res, next) => {
    try {
      const hashedPassword = await hashWithSecret(req.matchedData.password);

      const emailSecret = await makeSecret(6);
      const hashedEmailSecret = await hashWithSecret(emailSecret);

      const createdUser = await User.create({
        ...req.matchedData,
        password: hashedPassword,
        emailSecret: hashedEmailSecret
      });

      const updatedUser = await sendConfirmationEmail(resolveEntityId(createdUser));

      const token = await createToken({
        userId: resolveEntityId(updatedUser)
      });

      return res.json({
        token,
        user: updatedUser
      });
    } catch (error) {
      return next(
        createError("В данный момент невозможно совершить регистрацию. Попробуйте позже", error)
      );
    }
  }
);

router.get("/auth", [auth()], async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return next(createError("Пользователь не найден в бд"));
    }

    return res.json(user);
  } catch (error) {
    return next(createError("Не удается провести авторизацию. Обратитесь в тех. поддержку", error));
  }
});

router.get("/resend", mayUserResend, async (req, res, next) => {
  try {
    const email = req.query.email;

    if (!email) {
      return next(createError("E-mail адрес не указан"));
    }

    const user = await User.findOne({
      email: req.query.email
    });

    if (!user) {
      return next(createError("Пользователь не найден в бд"));
    }

    const updatedUser = await sendConfirmationEmail(resolveEntityId(user));

    return res.json(updatedUser);
  } catch (error) {
    console.log(error);
    return next(createError("Не удалось переслать E-mail"));
  }
});

router.post("/confirm", async (req, res, next) => {
  const { userId, secret } = req.body;

  try {
    if (!userId || !secret) {
      return next(createError("Вы не отправили идентификатор или секретный код"));
    }

    const user = await User.findById(userId);

    if (!user) {
      return next(createError("Не удалось найти пользователя в бд"));
    }

    if (!user.emailSecret || user.emailConfirmed) {
      return next(createError("Данный пользователь не ожидает подтверждения"));
    }

    const isVerified = await verifySomethingWithHashed(secret, user.emailSecret);

    if (!isVerified) {
      return next(createError("Неверный код подтверждения"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        emailConfirmed: true,
        emailSecret: null
      },
      {
        new: true
      }
    );

    return res.json(updatedUser);
  } catch (error) {
    return next(createError("Не удалось подтвердить E-mail"));
  }
});

router.get("/cancel", async (req, res, next) => {
  const { email } = req.query;

  try {
    if (!email) {
      return next(createError("Вы не указали E-mail адрес, который собираетесь отвязать"));
    }

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.json(true);
    }

    if (user.emailConfirmed) {
      return next(createError("Вы не можете отменить привязку E-mail'а от этого аккаунта"));
    }

    await User.remove({
      email
    });

    return res.json(true);
  } catch (error) {
    return next(createError("Не удалось отменить привязку"));
  }
});

export const user = router;
export default user;
