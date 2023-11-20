import { BaseRouter } from "./base.router";
import { TaskController } from "../controllers/tasks.controller";
import passport from "passport";

class TaskRouter extends BaseRouter {
  private readonly taskController: TaskController;
  constructor () {
    super();
    this.taskController = new TaskController();
    this.init();
  }

  protected init () {
    this.router.get("/", this.taskController.getTasks);
    this.router.get('/user/:id', passport.authenticate('jwt-access', { session: false }), this.taskController.getTasksByUserId);
    this.router.post('/', passport.authenticate('jwt-access', { session: false }), this.taskController.createTask);
    this.router.patch('/:id', passport.authenticate('jwt-access', { session: false }), this.taskController.updateTask);
    this.router.delete('/:id', passport.authenticate('jwt-access', { session: false }), this.taskController.deleteTask);
  }
}

export = new TaskRouter().router;