import { isISOString } from "@utils/isISOString";

export const updateValidation = {
  content: {
    custom: {
      options: value => {
        if (!value) {
          return true;
        }

        if (value.length < 10 || value.length > 1000) {
          throw new Error("Комментарий не может быть меньше 10 или больше 1000 символов");
        }
        return true;
      }
    }
  },
  fakeCreated: {
    custom: {
      options: value => {
        if (!value) {
          return true;
        }
        if (typeof value !== "string" || !isISOString(value)) {
          throw new Error("Неверное значение");
        }
        return true;
      }
    }
  }
};

export default updateValidation;
