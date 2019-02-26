import Transaction from "mongoose-transactions";
import { User } from "@models/User";
import * as models from "@consts/_models";
import { createError } from "@utils/createError";
import { Comment } from "@models/Comment";

export const createComment = async (data, userId, postId) => {
  const transaction = new Transaction();
  try {
    if (!userId) {
      throw createError("Идентификатор автора не указан");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw createError("Не удалось найти автора в бд");
    }

    const commentId = await transaction.insert(models.MODEL_COMMENT, {
      ...data,
      owner: userId,
      post: postId
    });

    await transaction.update(models.MODEL_USER, userId, {
      $push: {
        comments: commentId
      }
    });

    await transaction.run();

    const comment = await Comment.findOne(commentId);
    return Promise.resolve(comment);
  } catch (error) {
    await transaction.rollback();
    return Promise.reject(error);
  }
};
