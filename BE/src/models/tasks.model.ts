import mongoose from "mongoose";
import { Task } from "../types/task.type";

const TaskSchema = new mongoose.Schema<Task>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  assignor: { type: mongoose.Types.ObjectId, ref: 'User' },
  assignee: { type: mongoose.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['todo', 'inprogress', 'done'], default: 'todo' },
  createAt: { type: Date, default: Date.now },
});

export const TaskModel = mongoose.model<Task>("Task", TaskSchema);