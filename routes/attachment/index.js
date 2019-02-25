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
        key: req.file.key,
        size: req.file.size,
        contentType: req.file.contentType,
        owner: req.userId
      });

      return res.json(attachment);
    }
  } catch (error) {
    return next(createError("Не удалось загрузить файл", error));
  }
});

router.get("/entry", async (req, res, next) => {
  try {
    const attachmentId = req.query.attachmentId;

    if (!attachmentId) {
      return next(createError("Идентификатор вложения не указан"));
    }

    const attachment = await Attachment.findById(attachmentId);

    return res.json(attachment);
  } catch (error) {
    return next(createError("Не удалось загрузить вложение", error));
  }
});

export const attachment = router;
export default attachment;
