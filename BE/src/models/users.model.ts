import mongoose from "mongoose";
import { User } from "../types/user.type";

const UserSchema = new mongoose.Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  role: { type: String, default: "user" },
  refreshToken: { type: String, select: false},
  refreshTokenSalt: { type: String, select: false },
  createAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<User>("User", UserSchema);
