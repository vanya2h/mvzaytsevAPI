import password from "password-hash-and-salt";

export const hashWithSecret = something =>
  new Promise((resolve, reject) =>
    password(something + process.env.SECRET).hash((error, hashedPassword) => {
      if (error) {
        return reject(error);
      }
      return resolve(hashedPassword);
    })
  );

export default hashWithSecret;
