import { isISOString } from "@utils/isISOString";

export const updateValidation = {
  content: {
    optional: true,
    custom: {
      options: value => {
        if (value.length < 10 || value.length > 1000) {
          throw new Error("Комментарий не может быть меньше 10 или больше 1000 символов");
        }
        return true;
      }
    }
  },
  fakeCreated: {
    optional: true,
    custom: {
      options: value => {
        if (typeof value !== "string" || !isISOString(value)) {
          throw new Error("Неверное значение");
        }
        return true;
      }
    }
  }
};

export default updateValidation;
