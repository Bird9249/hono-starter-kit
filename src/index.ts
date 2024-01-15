import { Hono } from "hono";
import "reflect-metadata";
import Container from "typedi";

import { HTTPException, ValidationFailed } from "./common/exception/http";
import AuthRouter from "./modules/users/auth.router";
import UserRouter from "./modules/users/user.router";

class Application {
  public readonly hono: Hono = new Hono();

  constructor() {
    const userRouter = Container.get(UserRouter);
    const authRouter = Container.get(AuthRouter);

    this.hono
      .route("/users", userRouter.router)
      .route("/auth", authRouter.router)
      .onError((err, { json }) => {
        if (err instanceof ValidationFailed)
          return json({ message: err.message, error: err.error }, err.status);

        if (err instanceof HTTPException)
          return json(
            {
              message: err.message,
            },
            err.status
          );

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
