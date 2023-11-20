import { Task } from './task.type';

export type TaskResponse = {
  data: Task[];
  page: number;
  limit: number;
  totalPage: number;
}