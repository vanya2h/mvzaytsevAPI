import mongoose from "mongoose";
import { Attachment } from "@models/Attachment";

export const createValidation = {
  title: {
    custom: {
      options: value => {
        if (!value) {
          throw new Error("Не заполнено поле 'Заголовок'");
        }
        if (value.length > 120) {
          throw new Error("Заголовок поста не может быть больше 120 символов");
        }
        return true;
      }
    }
  },
  content: {
    custom: {
      options: value => {
        if (!value) {
          throw new Error("Не заполнено поле 'Текст'");
        }
        if (value.length > 40000) {
          throw new Error("Заголовок поста не может быть больше 40000 символов");
        }
        return true;
      }
    }
  },
  image: {
    custom: {
      options: async value => {
        if (!value) {
          return true;
        }

        if (!mongoose.Types.ObjectId.isValid(value)) {
          throw new Error("Неверный формат идентификатора изображения");
        }

        const attachment = await Attachment.findById(value);

        if (!attachment) {
          throw new Error("Изображение не найдено в базе данных");
        }

        return true;
      }
    }
  }
};

export default createValidation;
