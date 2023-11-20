import { Request, Response } from "express";  
import { TaskService } from "../services/task.service";
import { UserService } from "../services/user.service";
import { Task } from "../types/task.type";

type User = {
  id: string;
  username: string;
}

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

      const TaskResponse = await this.taskService.getTasksByUserId(page, limit, userId, search);

      return res.status(200).json(TaskResponse);      
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  }

  public async createTask(req: Request, res: Response): Promise<Response> {
    try {
      const assigneeId = req.body.assignee;
      const user  = JSON.parse(JSON.stringify(req?.user));
      if (!user) return res.status(401).json({ message: "Unauthorized" }); 

      const assignor = await this.userService.getUserById(user['id']);
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
      const user  = JSON.parse(JSON.stringify(req?.user));
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      // const task = await this.taskService.getTaskById(req.params.id);
      // if (task.assignor._id.toString() !== user['id']) {
      //   if (req.body.status) {

      //   }
      // }

      const updatedTask = await this.taskService.updateTask(req.params.id, req.body);

      return res.status(200).json(updatedTask);
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  }

  public async deleteTask(req: Request, res: Response): Promise<Response> {
    try {
      const task = await this.taskService.getTaskById(req.params.id);

      const user  = JSON.parse(JSON.stringify(req?.user));
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      if (user['id'] === task.assignee._id.toString()) {
        if (task.status !== "done") {
          return res.status(400).json({ message: "You Must complete the task!" });
        }
      } else {
        if (task.assignor._id.toString() !== user['id']) {
          return res.status(403).json({ message: "Forbidden" });
        }
      }


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
