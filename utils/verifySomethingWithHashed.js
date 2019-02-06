import password from "password-hash-and-salt";

export const verifySomethingWithHashed = (something, verifyAgainst) =>
  new Promise((resolve, reject) =>
    password(something + process.env.SECRET).verifyAgainst(verifyAgainst, (err, verified) => {
      if (err) {
        return reject(err);
      }

      return resolve(verified);
    })
  );

export default verifySomethingWithHashed;
