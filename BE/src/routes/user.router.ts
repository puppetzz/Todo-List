import { BaseRouter } from "./base.router";
import { UserController } from "../controllers/user.controller";
import passport from 'passport';

class UserRouter extends BaseRouter {
  private readonly userController: UserController;
  constructor() {
    super();
    this.userController = new UserController();
    this.init();
  }

  protected init() {
    this.router.get("/", this.userController.getAllUsers);
    this.router.get("/:id", this.userController.getUserById);
  }
}

export = new UserRouter().router;