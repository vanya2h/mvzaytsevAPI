import express from "express";
import { auth } from "@middlewares/auth";
import { handleValidation } from "@middlewares/handleValidation";
import { checkSchema } from "express-validator/check";
import { Post } from "@models/Post";
import { createValidation } from "./createValidation";
import { createError } from "@utils/createError";

const router = express.Router();

router.get("/entry", (req, res, next) =>
  Post.findById(req.query.postId)
    .then(post => {
      if (!post) {
        return next(createError("Пост не найден в базе данных"));
      }
      return res.json(post);
    })
    .catch(error => next(createError("Не удалось загрузить пост", error)))
);

router.get("/entries", (req, res, next) =>
  Post.find({}, null, {
    skip: +req.query.skip || 0,
    limit: +req.query.limit || 10,
    sort: {
      createdAt: -1
    }
  })
    .then(posts => res.json(posts))
    .catch(error => next(createError("Не удалось загрузить посты", error)))
);

router.post("/entry", [auth(), checkSchema(createValidation), handleValidation], (req, res, next) =>
  Post.create({
    ...req.matchedData,
    author: req.userId
  })
    .then(createdPost => res.json(createdPost))
    .catch(error => next(createError("Не удалось загрузить посты", error)))
);

export const post = router;

export default post;
