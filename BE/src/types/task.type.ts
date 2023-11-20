import { User } from "./user.type";

export type Task = {
  title: string;
  content: string;
  assignor: User;
  assignee: User;
  status: string;
  createAt: Date;
};