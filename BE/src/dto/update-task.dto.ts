import { User } from "types/user.type";

export type UpdateTaskDto = {
  title?: string;
  content?: string;
  assignee?: string | User;
  status?: string;
}