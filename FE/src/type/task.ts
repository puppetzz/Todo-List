import { User } from "./user"

export type Task = {
  _id: string
  title: string
  content: string
  assignor: User,
  assignee: User
  status: string
  createAt: string
}