import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    login: {
      type: String,
      isRequired: true,
      unique: true
    },
    name: {
      type: String,
      isRequired: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      isRequired: true,
      select: false
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt"
    }
  }
);

UserSchema.plugin(require("mongoose-autopopulate"));

export const User = mongoose.model("User", UserSchema);

export default User;
