import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      isRequired: true
    },
    emailSecret: {
      type: String,
      default: null
    },
    emailSendedAt: {
      type: Date,
      default: null
    },
    emailConfirmed: {
      type: Boolean,
      default: false
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
    },
    bio: {
      type: String,
      isRequired: false
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
