import { zValidator } from "@hono/zod-validator";
import { format } from "date-fns";
import { Hono } from "hono";
import { Inject, Service } from "typedi";
import { FORMAT_DATE_TIME } from "../../common/settings/format-date-time";
import zodException from "../../common/utils/zod-exception";
import PaginateSchema from "../../common/zod-schema/paginate.schema";
import paramIdSchema from "../../common/zod-schema/param-id.schema";
import CreateUserCommand from "./domain/commands/create-user.command";
import DeleteUserCommand from "./domain/commands/delete-user.command";
import RestoreUserCommand from "./domain/commands/restore-user.command";
import UpdateUserCommand from "./domain/commands/update-user.command";
import { CreateUserDto } from "./domain/dtos/create-user.dto";
import { UpdateUserDto } from "./domain/dtos/update-user.dto";
import User from "./domain/entities/user.entity";
import GetUserByIdQuery from "./domain/queries/get-user-by-id.query";
import GetUserQuery from "./domain/queries/get-user.query";
import { GetUserByIdDrizzleRepo } from "./drizzle/user/get-user-by-id.repository";
import { GetUserDrizzleRepo } from "./drizzle/user/get-user.repository";
import CreateUserCase from "./use-cases/create-user.case";
import DeleteUserCase from "./use-cases/delete-user.case";
import RestoreUserCase from "./use-cases/restore-user.case";
import UpdateUserCase from "./use-cases/update-user.case";

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

      if (!result.success) {
        return json(result.error.formErrors, 400);
      }

      const { data, total } = await this._getUserRepo.execute(
        new GetUserQuery({
          offset: result.data.offset as number,
          limit: result.data.limit as number,
          column: result.data.column as keyof User,
          sort_order: result.data.sort_order,
        })
      );

      return json(
        {
          data: data.map((data) => ({
            ...data,
            created_at: format(data.created_at, FORMAT_DATE_TIME),
            updated_at: format(data.updated_at, FORMAT_DATE_TIME),
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
      zValidator("json", CreateUserDto, (result, { json }) => {
        if (!result.success) {
          return json(result.error.formErrors, 400);
        }
      }),
      async ({ req, json }) => {
        const body = req.valid("json");

        const result = await this._createUserCase.execute(
          new CreateUserCommand(body)
        );

        return json(result, 201);
      }
    );
  }

  private _getById() {
    this.router.get(
      "/:id",
      zValidator("param", paramIdSchema, (result, c) =>
        zodException(result, c)
      ),
      async ({ req, json }) => {
        const { id } = req.valid("param");

        const result = await this._getUserByIdRepo.execute(
          new GetUserByIdQuery(Number(id))
        );

        if (!result) {
          return json({ message: "Not Found!" }, 404);
        }

        return json(
          {
            ...result,
            created_at: format(result.created_at, FORMAT_DATE_TIME),
            updated_at: format(result.updated_at, FORMAT_DATE_TIME),
          },
          200
        );
      }
    );
  }

  private _update() {
    this.router.put(
      "/:id",
      zValidator("param", paramIdSchema, (result, c) =>
        zodException(result, c)
      ),
      zValidator("json", UpdateUserDto, (result, c) => zodException(result, c)),
      async ({ req, json }) => {
        const body = req.valid("json");
        const param = req.valid("param");

        const result = await this._updateUserCase.execute(
          new UpdateUserCommand(parseInt(param.id), body)
        );

        return json(result, 200);
      }
    );
  }

  private _delete() {
    this.router.delete(
      "/:id",
      zValidator("param", paramIdSchema, (result, c) =>
        zodException(result, c)
      ),
      async ({ req, json }) => {
        const { id } = req.valid("param");

        const result = await this._deleteUserCase.execute(
          new DeleteUserCommand(parseInt(id))
        );

        return json(result, 200);
      }
    );
  }

  private _restore() {
    this.router.patch(
      "/:id/restore",
      zValidator("param", paramIdSchema, (result, c) =>
        zodException(result, c)
      ),
      async ({ req, json }) => {
        const { id } = req.valid("param");

        const result = await this._restoreUserCase.execute(
          new RestoreUserCommand(parseInt(id))
        );

        return json(result, 200);
      }
    );
  }
}
