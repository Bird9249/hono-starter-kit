import { Hono } from "hono";
import "reflect-metadata";
import Container from "typedi";

import UserRouter from "./modules/users/user.router";

class Application {
  public readonly hono: Hono = new Hono();

  constructor() {
    const userRouter = Container.get(UserRouter);

    this.hono.route("/users", userRouter.router).onError((err, { json }) => {
      return json(
        {
          message: "Internal Server Error!",
          error: {
            name: err.name,
            message: err.message,
            cause: err.cause,
            stack: err.stack,
          },
        },
        500
      );
    });
  }
}

export default new Application().hono;
