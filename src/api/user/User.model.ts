import mongoose, { Schema } from "mongoose";
import { IUser } from "./User.defination";

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"]
    },
    password: {
      type: String
      //   required: [true, "Password is required"],
      //   minlength: [6, "Password must be at least 6 characters long"]
    },
    roles: {
      type: [String],
      default: ["user"]
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.isDeleted;
  return obj;
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
