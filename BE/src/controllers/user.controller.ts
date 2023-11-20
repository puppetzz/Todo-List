import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  private readonly userService: UserService;
  constructor() {
    this.userService = new UserService();
    this.getAllUsers = this.getAllUsers.bind(this);
    this.getUserById = this.getUserById.bind(this);
  }

  public async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();

      return res.status(200).json(users);
    } catch(err) {
      return res.status(500).json({ message: err.message });
    }
  }
  
  public async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userService.getUserById(req.params.id);

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}