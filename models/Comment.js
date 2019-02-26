import mongoose from "mongoose";
import * as models from "@consts/_models";

const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      isRequired: true
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: models.MODEL_POST,
      required: true,
      autopopulate: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: models.MODEL_USER,
      required: true,
      autopopulate: true
    },
    fakeCreated: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

CommentSchema.plugin(require("mongoose-autopopulate"));

export const Comment = mongoose.model(models.MODEL_COMMENT, CommentSchema);

export default Comment;
