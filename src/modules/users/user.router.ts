import { format } from "date-fns";
import { Hono } from "hono";
import { validator } from "hono/validator";
import Container from "typedi";
import { IPaginate } from "../../common/interfaces/pagination/pagination.interface";
import queryParamMiddleware from "../../common/middlewares/query-param.middleware";
import { FORMAT_DATE_TIME } from "../../common/settings/format-date-time";
import zodException from "../../common/utils/zod-exception";
import paramIdSchema from "../../common/zod-schema/param-id.schema";
import CreateUserCommand from "./domain/commands/users/create-user.command";
import DeleteUserCommand from "./domain/commands/users/delete-user.command";
import RestoreUserCommand from "./domain/commands/users/restore-user.command";
import UpdateUserCommand from "./domain/commands/users/update-user.command";
import {
  CreateUserDto,
  CreateUserDtoType,
} from "./domain/dtos/users/create-user.dto";
import {
  UpdateUserDto,
  UpdateUserDtoType,
} from "./domain/dtos/users/update-user.dto";
import GetUserByIdQuery from "./domain/queries/users/get-user-by-id.query";
import GetUserQuery from "./domain/queries/users/get-user.query";
import { UserSchema } from "./drizzle/schema";
import { GetUserByIdDrizzleRepo } from "./drizzle/user/get-user-by-id.repository";
import { GetUserDrizzleRepo } from "./drizzle/user/get-user.repository";
import CreateUserCase from "./use-cases/users/create-user.case";
import DeleteUserCase from "./use-cases/users/delete-user.case";
import RestoreUserCase from "./use-cases/users/restore-user.case";
import UpdateUserCase from "./use-cases/users/update-user.case";

const UserRouter = new Hono();

const createUserCase = Container.get(CreateUserCase);
const updateUserCase = Container.get(UpdateUserCase);
const getUserRepo = Container.get(GetUserDrizzleRepo);
const getUserByIdRepo = Container.get(GetUserByIdDrizzleRepo);
const deleteUserCase = Container.get(DeleteUserCase);
const restoreUserCase = Container.get(RestoreUserCase);

const userProperties: (keyof UserSchema)[] = [
  "username",
  "email",
  "created_at",
  "updated_at",
];

UserRouter.get(
  "/",
  async (c, next) => await queryParamMiddleware(c, next, userProperties),
  async ({ req, json }) => {
    const query = req.query() as IPaginate<UserSchema>;

    const { data, total } = await getUserRepo.execute(
      new GetUserQuery({
        offset: query.offset,
        limit: query.limit,
        column: query.column,
        sort_order: query.sort_order,
      })
    );

    return json(
      {
        data: data.map((data) => ({
          ...data,
          created_at: data.created_at
            ? format(data.created_at, FORMAT_DATE_TIME)
            : undefined,
          updated_at: data.updated_at
            ? format(data.updated_at, FORMAT_DATE_TIME)
            : undefined,
        })),
        total,
      },
      200
    );
  }
)
  .post(
    "/",
    validator("json", (result) => zodException(CreateUserDto, result)),
    async ({ req, json }) => {
      const body = req.valid("json") as CreateUserDtoType;

      const result = await createUserCase.execute(new CreateUserCommand(body));

      return json(
        {
          id: result.id,
          username: result.username.getValue(),
          email: result.email.getValue(),
          created_at: result.created_at.getValue(),
          updated_at: result.updated_at.getValue(),
        },
        201
      );
    }
  )
  .get(
    "/:id",
    validator("param", (result) => zodException(paramIdSchema, result)),
    async ({ req, json }) => {
      const { id } = req.valid("param");

      const result = await getUserByIdRepo.execute(
        new GetUserByIdQuery(Number(id))
      );

      return json(
        {
          ...result,
          created_at: result.created_at
            ? format(result.created_at, FORMAT_DATE_TIME)
            : undefined,
          updated_at: result.updated_at
            ? format(result.updated_at, FORMAT_DATE_TIME)
            : undefined,
        },
        200
      );
    }
  )
  .put(
    "/:id",
    validator("param", (result) => zodException(paramIdSchema, result)),
    validator("json", (result) => zodException(UpdateUserDto, result)),
    async ({ req, json }) => {
      const body = req.valid("json") as UpdateUserDtoType;
      const param = req.valid("param");

      const result = await updateUserCase.execute(
        new UpdateUserCommand(parseInt(param.id), body)
      );

      return json(
        {
          id: result.id,
          username: result.username.getValue(),
          email: result.email.getValue(),
          created_at: result.created_at.getValue(),
          updated_at: result.updated_at.getValue(),
        },
        200
      );
    }
  )
  .delete(
    "/:id",
    validator("param", (result) => zodException(paramIdSchema, result)),
    async ({ req, json }) => {
      const { id } = req.valid("param");

      const result = await deleteUserCase.execute(
        new DeleteUserCommand(parseInt(id))
      );

      return json(
        {
          id: result.id,
          username: result.username.getValue(),
          email: result.email.getValue(),
          created_at: result.created_at.getValue(),
          updated_at: result.updated_at.getValue(),
        },
        200
      );
    }
  )
  .patch(
    "/:id/restore",
    validator("param", (result) => zodException(paramIdSchema, result)),
    async ({ req, json }) => {
      const { id } = req.valid("param");

      const result = await restoreUserCase.execute(
        new RestoreUserCommand(parseInt(id))
      );

      return json(
        {
          id: result.id,
          username: result.username.getValue(),
          email: result.email.getValue(),
          created_at: result.created_at.getValue(),
          updated_at: result.updated_at.getValue(),
        },
        200
      );
    }
  );

export default UserRouter;
