import { format } from "date-fns";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { Inject, Service } from "typedi";
import { object, z } from "zod";
import { ValidationFailed } from "../../common/exception/http";
import { FORMAT_DATE_TIME } from "../../common/settings/format-date-time";
import zodException from "../../common/utils/zod-exception";
import PaginateSchema from "../../common/zod-schema/paginate.schema";
import paramIdSchema from "../../common/zod-schema/param-id.schema";
import CreateRoleCommand from "./domain/commands/roles/create-role.command";
import DeleteRoleCommand from "./domain/commands/roles/delete-role.command";
import RestoreRoleCommand from "./domain/commands/roles/restore-role.command";
import UpdateRoleCommand from "./domain/commands/roles/update-role.command";
import {
  CreateRoleDto,
  CreateRoleDtoType,
} from "./domain/dtos/roles/create-role.dto";
import {
  UpdateRoleDto,
  UpdateRoleDtoType,
} from "./domain/dtos/roles/update-role.dto";
import GetRoleByIdQuery from "./domain/queries/roles/get-role-by-id.query";
import GetRoleQuery from "./domain/queries/roles/get-role.query";
import { GetRoleByIdDrizzleRepo } from "./drizzle/roles/get-role-by-id.repository";
import { GetRoleDrizzleRepo } from "./drizzle/roles/get-role.repository";
import { RoleSchema } from "./drizzle/schema";
import CreateRoleCase from "./use-cases/roles/create-role.case";
import DeleteRoleCase from "./use-cases/roles/delete-role.case";
import RestoreRoleCase from "./use-cases/roles/restore-role.case";
import UpdateRoleCase from "./use-cases/roles/update-role.case";

@Service()
export default class RoleRouter {
  public readonly router: Hono = new Hono();

  constructor(
    @Inject() private readonly _getRoleRepo: GetRoleDrizzleRepo,
    @Inject() private readonly _createRoleCase: CreateRoleCase,
    @Inject() private readonly _getRoleByIdCase: GetRoleByIdDrizzleRepo,
    @Inject() private readonly _updateRoleCase: UpdateRoleCase,
    @Inject() private readonly _deleteRoleCase: DeleteRoleCase,
    @Inject() private readonly _restoreRoleCase: RestoreRoleCase
  ) {
    this._create();
    this._update();
    this._delete();
    this._restore();
    this._getAll();
    this._getById();
  }

  private _getAll() {
    this.router.get("/", async ({ req, json }) => {
      const query = req.query();
      const roleProperties: (keyof RoleSchema)[] = [
        "name",
        "created_at",
        "updated_at",
        "deleted_at",
      ];

      const result = PaginateSchema.merge(
        object({
          column: z.enum(["id", ...roleProperties]).nullish(),
        })
      ).safeParse(query);

      if (!result.success) throw new ValidationFailed(result);

      const { data, total } = await this._getRoleRepo.execute(
        new GetRoleQuery({
          offset: result.data.offset as number,
          limit: result.data.limit as number,
          column: result.data.column,
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

  private _create() {
    this.router.post(
      "/",
      validator("json", (result) => zodException(CreateRoleDto, result)),
      async ({ req, json }) => {
        const body = req.valid("json") as CreateRoleDtoType;

        const result = await this._createRoleCase.execute(
          new CreateRoleCommand(body)
        );

        return json(
          {
            id: result.id,
            name: result.name.getValue(),
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

        const result = await this._getRoleByIdCase.execute(
          new GetRoleByIdQuery(Number(id))
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
      validator("json", (result) => zodException(UpdateRoleDto, result)),
      async ({ req, json }) => {
        const body = req.valid("json") as UpdateRoleDtoType;
        const param = req.valid("param");

        const result = await this._updateRoleCase.execute(
          new UpdateRoleCommand(param.id, body)
        );

        return json(
          {
            id: result.id,
            name: result.name.getValue(),
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

        const result = await this._deleteRoleCase.execute(
          new DeleteRoleCommand(parseInt(id))
        );

        return json(
          {
            id: result.id,
            name: result.name.getValue(),
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

        const result = await this._restoreRoleCase.execute(
          new RestoreRoleCommand(parseInt(id))
        );

        return json(
          {
            id: result.id,
            name: result.name.getValue(),
            created_at: result.created_at.getValue(),
            updated_at: result.updated_at.getValue(),
          },
          200
        );
      }
    );
  }
}
