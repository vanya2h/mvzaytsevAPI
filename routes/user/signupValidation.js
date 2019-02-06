export const signupValidation = {
  name: {
    custom: {
      options: value => {
        if (!value) {
          throw new Error("Не заполнено поле 'Полное имя'");
        }
        if (value.length < 6 || value.length > 36) {
          throw new Error("Длина имени не может быть меньше 6 или больше 35 символов");
        }
        return true;
      }
    }
  },
  login: {
    custom: {
      options: value => {
        if (!value) {
          throw new Error("Не заполнено поле 'Логин'");
        }
        if (value.length < 6 || value.length > 36) {
          throw new Error("Длина логина не может быть меньше 6 или больше 35 символов");
        }
        return true;
      }
    }
  },
  password: {
    custom: {
      options: value => {
        if (!value) {
          throw new Error("Не заполнено поле 'Пароль'");
        }
        if (value.length < 6 || value.length > 36) {
          throw new Error("Длина пароля не может быть меньше 6 или больше 36 символов");
        }
        return true;
      }
    }
  }
};

export default signupValidation;
