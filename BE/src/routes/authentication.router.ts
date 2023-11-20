import { BaseRouter } from "./base.router";
import { AuthenticationController } from "../controllers/authentication.controller";

class AuthenticationRouter extends BaseRouter {
  private readonly authenticationController: AuthenticationController;
  constructor() {
    super();
    this.authenticationController = new AuthenticationController();
    this.init();
  }

  protected init() {
    this.router.post("/register/", this.authenticationController.register);
    this.router.post("/login/", this.authenticationController.login);
  }
}

export = new AuthenticationRouter().router;