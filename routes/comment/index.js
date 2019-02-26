import express from "express";
import { auth } from "@middlewares/auth";
import { handleValidation } from "@middlewares/handleValidation";
import { checkSchema } from "express-validator/check";
import { createComment } from "@transactions/comment/createComment";
import { Comment } from "@models/Comment";
import { createValidation } from "./createValidation";
import { createError } from "@utils/createError";
import { parseQuery } from "./middlewares/parseQuery";
import { parsePost } from "./middlewares/parsePost";

const router = express.Router();

router.get("/entry", async (req, res, next) => {
  try {
    const commentId = req.query.commentId;

    if (!commentId) {
      return next(createError("Вы не указали идентификатор комментария"));
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(createError("Комментарий не найден в бд."));
    }

    return res.json(comment);
  } catch (error) {
    return next(createError("Не удалось загрузить комментарий", error));
  }
});

router.get("/entries", parseQuery, async (req, res, next) => {
  try {
    const comments = await Comment.find(req.parsedQuery, null, {
      skip: +req.query.skip || 0,
      limit: +req.query.limit || 10,
      sort: {
        createdAt: -1
      }
    });
    return res.json(comments);
  } catch (error) {
    return next(createError("Не удалось загрузить комментарии", error));
  }
});

router.post(
  "/entry",
  [auth(), checkSchema(createValidation), handleValidation, parsePost],
  async (req, res, next) => {
    try {
      const comment = await createComment(req.matchedData, req.userId, req.postId);
      return res.json(comment);
    } catch (reason) {
      return next(createError("Не удалось создать пост", reason));
    }
  }
);

export const comment = router;

export default comment;
