import express from "express";
import { auth } from "@middlewares/auth";
import { handleValidation } from "@middlewares/handleValidation";
import { checkSchema } from "express-validator/check";
import { Post } from "@models/Post";
import { resolveEntityId } from "@utils/resolveEntityId";
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

router.get("/like", auth(), async (req, res, next) => {
  try {
    const postId = req.query.postId;

    if (!postId) {
      return next(createError("Не указан идентификатор поста"));
    }

    const post = await Post.findById(postId);

    if (!post) {
      return next(createError("Пост не найден в бд"));
    }

    const action = post.likes.indexOf(req.userId) === -1 ? "$addToSet" : "$pull";

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        [action]: {
          likes: req.userId
        }
      },
      { new: true }
    );

    return res.json(updatedPost);
  } catch (error) {
    return next(createError("Не удалось поставить лайк"));
  }
});

router.get("/latest", async (req, res, next) => {
  try {
    const latest = await Post.findOne();
    return res.json(resolveEntityId(latest));
  } catch (error) {
    return next(createError("Не удалось получить последний пост"));
  }
});

export const post = router;

export default post;
