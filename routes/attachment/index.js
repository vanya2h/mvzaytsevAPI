import express from "express";
import { auth } from "@middlewares/auth";
import { createError } from "@utils/createError";
import multer from "@root/storage";
import { Attachment } from "@models/index";

const router = express.Router();

router.post("/upload", [auth(), multer.single("file")], async (req, res, next) => {
  try {
    if (req.file) {
      const attachment = await Attachment.create({
        url: `${req.file.filename}`,
        owner: req.userId
      });

      return res.json(attachment);
    }
  } catch (error) {
    console.error("Ошибка загрузки файла", error);
    next(createError("Не удалось загрузить файл", error));
  }
});

export const attachment = router;
export default attachment;
