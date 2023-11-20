import { Task } from './task';

export type TaskResponse = {
  tasks: Task[],
  page: number,
  limit: number,
  totalPage: number,
}