import { Request, Response } from "express";  
import { TaskService } from "../services/task.service";
import { UserService } from "../services/user.service";
import { Task } from "../types/task.type";

export class TaskController {
  private readonly taskService: TaskService;
  private readonly userService: UserService;
  constructor() {
    this.taskService = new TaskService();
    this.userService = new UserService();
    this.createTask = this.createTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.getTasks = this.getTasks.bind(this); 
    this.getTasksByUserId = this.getTasksByUserId.bind(this);
  }

  public async getTasks(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const search = req.query.search as string || "";

      const TaskResponse = await this.taskService.getTasks(page, limit, search);

      return res.status(200).json(TaskResponse);      
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  }

  public async getTasksByUserId(req: Request, res: Response): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const search = req.query.search as string || "";
      const userId = req.params.id;

      console.log(req.user);

      const TaskResponse = await this.taskService.getTasksByUserId(page, limit, userId, search);

      return res.status(200).json(TaskResponse);      
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  }

  public async createTask(req: Request, res: Response): Promise<Response> {
    try {
      const assignorId = req.body.assignor;
      const assigneeId = req.body.assignee;

      const assignor = await this.userService.getUserById(assignorId);
      const assignee = await this.userService.getUserById(assigneeId);

      if (!assignor) {
        return res.status(404).json({ message: "Assignor not found" });
      }
      if (!assignee) {
        return res.status(404).json({ message: "Assignee not found" });
      }

      const taskDto: Task = {
        title: req.body.title,
        content: req.body.content,
        assignor: assignor,
        assignee: assignee,
        status: req.body.status || undefined,
        createAt: new Date()
      }

      const newTask = await this.taskService.createTask(taskDto);

      return res.status(201).json(newTask);
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  }

  public async updateTask(req: Request, res: Response): Promise<Response> {
    try {
      await this.taskService.updateTask(req.params.id, req.body);

      const updatedTask = await this.taskService.getTaskById(req.params.id);

      return res.status(200).json(updatedTask);
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  }

  public async deleteTask(req: Request, res: Response): Promise<Response> {
    try {
      const task = await this.taskService.getTaskById(req.params.id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      await this.taskService.deleteTask(req.params.id);

      return res.sendStatus(204);
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  }
}
