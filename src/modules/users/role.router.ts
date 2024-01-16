import { Hono } from "hono";
import { validator } from "hono/validator";
import { Inject, Service } from "typedi";
import zodException from "../../common/utils/zod-exception";
import CreateRoleCommand from "./domain/commands/roles/create-role.command";
import {
  CreateRoleDto,
  CreateRoleDtoType,
} from "./domain/dtos/roles/create-role.dto";
import CreateRoleCase from "./use-cases/roles/create-role.case";

@Service()
export default class RoleRouter {
  public readonly router: Hono = new Hono();

  constructor(@Inject() private readonly _createRoleCase: CreateRoleCase) {
    this._create();
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

        return json(result, 201);
      }
    );
  }
}
