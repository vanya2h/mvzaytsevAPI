import jwt from "jsonwebtoken";

export const verifyToken = token =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (!err && decoded) {
        return resolve(decoded);
      }
      return reject(err);
    })
  );

export default verifyToken;
