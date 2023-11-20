import { BaseRouter } from "./base.router";
import bodyParser from 'body-parser';
import cors from "cors";
import userRouter from "./user.router";
import taskRouter from "./task.router";
import authenticationRouter from "./authentication.router";
require("../passport/access.passport");
require("../passport/refresh.passport");

class MasterRouter extends BaseRouter {
  constructor() {
    super();
    this.configure();
    this.init();
  }

  private configure() {
    // define configurations
    this.router.use(cors());

    this.router.use(bodyParser.json()); // to support JSON-encoded bodies
    this.router.use(
      bodyParser.urlencoded({
        // to support URL-encoded bodies
        extended: true,
      })
    );
  }

  /**
   * Connect routes to their matching routers.
   */
  protected init() {
    this.router.use("/user/", userRouter);
    this.router.use('/task/', taskRouter);
    this.router.use('/auth/', authenticationRouter);
  }
}

export = new MasterRouter().router;
