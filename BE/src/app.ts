import { Server } from "./server";
import dotenv from "dotenv";
import mongoose from "mongoose";

/**
 * Application class.
 * @description Handle init config and components.
 */
dotenv.config({
  path: ".env",
});

export class Application {
  private _mongoURI: string = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/local";
  server: Server;

  init() {
    this.initServer();
  }

  private initServer() {
    this.server = new Server();
  }

  start() {
    ((port = process.env.APP_PORT || 5000) => {
      this.server.app.listen(port, () =>
        console.log(`> Listening on port ${port}`)
      );
      this.server.app.use('/api', this.server.router);
      mongoose.Promise = Promise;
      mongoose.connect(this._mongoURI);
      mongoose.connection.on('error', (err: Error) => {
        console.error(`MongoDB connection error: ${err}`);
      });
    })();
  }
}
