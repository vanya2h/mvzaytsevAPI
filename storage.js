import multer from "multer";
import crypto from "crypto";
import mime from "mime";
import { config } from "./config";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.app.uploadDir);
  },
  filename: (req, file, cb) => {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      cb(null, `${raw.toString("hex") + Date.now()}.${mime.getExtension(file.mimetype)}`);
    });
  }
});

const upload = multer({ storage });

export default upload;
