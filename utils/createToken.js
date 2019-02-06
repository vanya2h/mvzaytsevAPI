import jwt from "jsonwebtoken";

export const createToken = (payload, options) =>
  console.log(payload, options) ||
  new Promise((resolve, reject) => {
    try {
      const token = jwt.sign(
        payload,
        process.env.SECRET,
        options || {
          expiresIn: "31d"
        }
      );

      resolve(token);
    } catch (error) {
      reject(error);
    }
  });

export default createToken;
