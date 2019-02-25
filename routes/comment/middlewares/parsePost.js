import { createError } from "@utils/createError";
import { Post } from "@models/Post";

export const parsePost = async (req, res, next) => {
  try {
    const postId = req.body.postId;

    if (!postId) {
      return next(createError("Идентификатор поста не указан"));
    }

    const post = await Post.findById(postId);

    if (!post) {
      return next(createError("Пост не найден"));
    }

    req.postId = postId;
    return next();
  } catch (error) {
    return next(createError("Не удалось разместить комментарий"));
  }
};

export default parsePost;
