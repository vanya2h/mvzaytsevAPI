import { sendemail } from "@utils/sendemail";
import { User } from "@models/User";
import { confirm } from "@email/user/confirm";
import { hashWithSecret, makeSecret, createError } from "@utils/index";

export const sendConfirmationEmail = async userId => {
  try {
    const secret = makeSecret(6);
    const emailSecret = await hashWithSecret(secret);

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("Не удалось найти пользователя в бд");
    }

    await sendemail(user.email, "Подтверждение аккаунта MVZaytsev.ru", confirm(secret));

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        emailSecret,
        emailSendedAt: new Date()
      },
      {
        new: true
      }
    );

    return updatedUser;
  } catch (error) {
    throw createError("Не удалось отправить подтверждающее письмо", error);
  }
};

export default sendConfirmationEmail;
