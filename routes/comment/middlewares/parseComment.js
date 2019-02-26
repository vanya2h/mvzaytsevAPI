import { createError } from "@utils/createError";
import { Comment } from "@models/Comment";

export const parseComment = async (req, _, next) => {
  try {
    const commentId = req.query.commentId;

    if (!commentId) {
      return next(createError("Идентификатор комментария не указан"));
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return next(createError("Комментарий не найден"));
    }

    req.commentId = commentId;
    return next();
  } catch (error) {
    return next(createError("Не удалось обновить комментарий"));
  }
};

export default parseComment;
