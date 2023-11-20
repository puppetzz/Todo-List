import { TaskModel } from "../models/tasks.model";
import { Task } from "../types/task.type";
import { UpdateTaskDto } from "../dto/update-task.dto";
import { TaskResponse } from "../types/task-response";
import { UserModel } from "../models/users.model";

export class TaskService {
  constructor() {
  }

  public async getAllTasks(page: number, limit: number): Promise<TaskResponse> {
    const tasks = await TaskModel.find().skip((page - 1) * limit).limit(limit).populate("assignor").populate("assignee");

    const totalTask = await TaskModel.countDocuments();
    
    const totalPage = Math.ceil(totalTask / limit);

    return {
      data: tasks,
      page: page,
      limit: limit,
      totalPage: totalPage,
    };
  }

  public async getTasks(page: number, limit: number, search: string): Promise<TaskResponse> {
    const tasks = await TaskModel.find({
      title: {
        $regex: `.*${search}.*`, $options: 'i'
      }}).skip((page - 1) * limit)
      .limit(limit)
      .populate("assignor")
      .populate("assignee");


    const totalTask = await TaskModel.countDocuments();
    
    const totalPage = Math.ceil(totalTask / limit);

    return {
      data: tasks,
      page: page,
      limit: limit,
      totalPage: totalPage,
    };
  }

  public async getTasksByUserId(page: number, limit: number, userId: string, search: string): Promise<TaskResponse> {
    const tasks = await TaskModel.find({
      title: {
        $regex: `.*${search}.*`, $options: 'i'
      },
      assignee: {
        _id: userId
      }}).skip((page - 1) * limit)
      .limit(limit)
      .populate("assignor")
      .populate("assignee");


    const totalTask = (await await TaskModel.find({
      title: {
        $regex: `.*${search}.*`, $options: 'i'
      },
      assignee: {
        _id: userId
      }})).length;
    
    const totalPage = Math.ceil(totalTask / limit);

    return {
      data: tasks,
      page: page,
      limit: limit,
      totalPage: totalPage,
    };
  }

  public async getTaskById(id: string) {
    const task = await TaskModel.find({ _id: id }).populate("assignor").populate("assignee");
    return task[0];
  }

  public async createTask(task: Task) {
    const newTask = await TaskModel.create(task);
    return newTask;
  }

  public async updateTask(id: string, updateTaskDto: UpdateTaskDto) {

    if (updateTaskDto.assignee) {
      updateTaskDto.assignee = await UserModel.findById(updateTaskDto.assignee);
    }

    const updatedTask = await TaskModel.findByIdAndUpdate(id, updateTaskDto);
    return updatedTask;
  }

  public async deleteTask(id: string) {
    const deletedTask = await TaskModel.findByIdAndDelete(id);

    return deletedTask;
  }
}