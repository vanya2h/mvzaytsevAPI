import mongoose from "mongoose";

const { Schema } = mongoose;

const AttachmentSchema = new Schema(
  {
    url: {
      type: String,
      isRequired: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

AttachmentSchema.plugin(require("mongoose-autopopulate"));

export const Attachment = mongoose.model("Attachment", AttachmentSchema);

export default Attachment;
