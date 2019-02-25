import multer from "multer";
import crypto from "crypto";
import mime from "mime";
import multerS3 from "multer-s3";
import { aws } from "./aws";

const storage = multer({
  storage: multerS3({
    s3: aws,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata(_, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      crypto.pseudoRandomBytes(16, (_, raw) => {
        cb(
          null,
          `${req.userId}/${raw.toString("hex") + Date.now()}.${mime.getExtension(file.mimetype)}`
        );
      });
    }
  })
});

export default storage;
