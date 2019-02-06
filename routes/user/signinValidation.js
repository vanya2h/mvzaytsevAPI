export const signinValidation = {
  login: {
    custom: {
      options: value => {
        if (!value) {
          throw new Error("Не заполнено поле 'Логин'");
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
        return true;
      }
    }
  }
};

export default signinValidation;
