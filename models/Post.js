import mongoose from "mongoose";

const { Schema } = mongoose;

const PostSchema = new Schema(
  {
    title: {
      type: "String",
      isRequired: true
    },
    content: {
      type: String,
      isRequired: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      autopopulate: true
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attachment",
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

export const Post = mongoose.model("Post", PostSchema);

export default Post;
