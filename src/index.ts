import { Hono } from "hono";
import "reflect-metadata";
import { HTTPException, ValidationFailed } from "./common/exception/http";
import AuthRouter from "./modules/users/auth.router";
import RoleRouter from "./modules/users/role.router";
import UserRouter from "./modules/users/user.router";

const app = new Hono()
  .route("/users", UserRouter)
  .route("/auth", AuthRouter)
  .route("/roles", RoleRouter)
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

    console.log(err);

    return json(
      {
        message: "Internal Server Error!",
        error: {
          ...err,
        },
      },
      500
    );
  });

export default app;
