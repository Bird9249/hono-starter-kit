import { Hono } from "hono";
import { validator } from "hono/validator";
import { Inject, Service } from "typedi";
import zodException from "../../common/utils/zod-exception";
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
import CreateRoleCase from "./use-cases/roles/create-role.case";
import DeleteRoleCase from "./use-cases/roles/delete-role.case";
import RestoreRoleCase from "./use-cases/roles/restore-role.case";
import UpdateRoleCase from "./use-cases/roles/update-role.case";

@Service()
export default class RoleRouter {
  public readonly router: Hono = new Hono();

  constructor(
    @Inject() private readonly _createRoleCase: CreateRoleCase,
    @Inject() private readonly _updateRoleCase: UpdateRoleCase,
    @Inject() private readonly _deleteRoleCase: DeleteRoleCase,
    @Inject() private readonly _restoreRoleCase: RestoreRoleCase
  ) {
    this._create();
    this._update();
    this._delete();
    this._restore();
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
