import { Hono } from "hono";
import { validator } from "hono/validator";
import { Inject, Service } from "typedi";
import zodException from "../../common/utils/zod-exception";
import paramIdSchema from "../../common/zod-schema/param-id.schema";
import CreateRoleCommand from "./domain/commands/roles/create-role.command";
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
import UpdateRoleCase from "./use-cases/roles/update-role.case";

@Service()
export default class RoleRouter {
  public readonly router: Hono = new Hono();

  constructor(
    @Inject() private readonly _createRoleCase: CreateRoleCase,
    @Inject() private readonly _updateRoleCase: UpdateRoleCase
  ) {
    this._create();
    this._update();
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
}
