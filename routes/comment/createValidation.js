export const createValidation = {
  content: {
    custom: {
      options: value => {
        if (!value) {
          throw new Error("Не заполнено поле 'Комментарий'");
        }
        if (value.length < 10 || value.length > 1000) {
          throw new Error("Комментарий не может быть меньше 10 или больше 1000 символов");
        }
        return true;
      }
    }
  }
};

export default createValidation;
