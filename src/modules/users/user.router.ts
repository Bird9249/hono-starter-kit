import { format } from "date-fns";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { Inject, Service } from "typedi";
import { ValidationFailed } from "../../common/exception/http";
import { FORMAT_DATE_TIME } from "../../common/settings/format-date-time";
import zodException from "../../common/utils/zod-exception";
import PaginateSchema from "../../common/zod-schema/paginate.schema";
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

@Service()
export default class UserRouter {
  public readonly router: Hono = new Hono();

  constructor(
    @Inject() private readonly _createUserCase: CreateUserCase,
    @Inject() private readonly _updateUserCase: UpdateUserCase,
    @Inject() private readonly _getUserRepo: GetUserDrizzleRepo,
    @Inject() private readonly _getUserByIdRepo: GetUserByIdDrizzleRepo,
    @Inject() private readonly _deleteUserCase: DeleteUserCase,
    @Inject() private readonly _restoreUserCase: RestoreUserCase
  ) {
    this._getAll();
    this._createNew();
    this._getById();
    this._update();
    this._delete();
    this._restore();
  }

  private _getAll() {
    this.router.get("/", async ({ req, json }) => {
      const query = req.query();

      const result = PaginateSchema.safeParse(query);

      if (!result.success) throw new ValidationFailed(result);

      const { data, total } = await this._getUserRepo.execute(
        new GetUserQuery({
          offset: result.data.offset as number,
          limit: result.data.limit as number,
          column: result.data.column as keyof UserSchema,
          sort_order: result.data.sort_order,
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
    });
  }

  private _createNew() {
    this.router.post(
      "/",
      validator("json", (result) => zodException(CreateUserDto, result)),
      async ({ req, json }) => {
        const body = req.valid("json") as CreateUserDtoType;

        const result = await this._createUserCase.execute(
          new CreateUserCommand(body)
        );

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
    );
  }

  private _getById() {
    this.router.get(
      "/:id",
      validator("param", (result) => zodException(paramIdSchema, result)),
      async ({ req, json }) => {
        const { id } = req.valid("param");

        const result = await this._getUserByIdRepo.execute(
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
    );
  }

  private _update() {
    this.router.put(
      "/:id",
      validator("param", (result) => zodException(paramIdSchema, result)),
      validator("json", (result) => zodException(UpdateUserDto, result)),
      async ({ req, json }) => {
        const body = req.valid("json") as UpdateUserDtoType;
        const param = req.valid("param");

        const result = await this._updateUserCase.execute(
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
    );
  }

  private _delete() {
    this.router.delete(
      "/:id",
      validator("param", (result) => zodException(paramIdSchema, result)),
      async ({ req, json }) => {
        const { id } = req.valid("param");

        const result = await this._deleteUserCase.execute(
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
    );
  }

  private _restore() {
    this.router.patch(
      "/:id/restore",
      validator("param", (result) => zodException(paramIdSchema, result)),
      async ({ req, json }) => {
        const { id } = req.valid("param");

        const result = await this._restoreUserCase.execute(
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
  }
}
