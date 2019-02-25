import mongoose from "mongoose";
import * as models from "@consts/_models";

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      isRequired: true
    },
    description: {
      type: String,
      isRequired: true
    },
    content: {
      type: String,
      isRequired: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: models.MODEL_USER,
      required: true,
      autopopulate: true
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: models.MODEL_USER,
        unique: true,
        default: []
      }
    ],
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: models.MODEL_ATTACHMENT,
      required: false,
      autopopulate: true
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

PostSchema.plugin(require("mongoose-autopopulate"));

export const Post = mongoose.model(models.MODEL_POST, PostSchema);

export default Post;
