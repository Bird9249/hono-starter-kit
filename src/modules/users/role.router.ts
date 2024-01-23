import { format } from "date-fns";
import { Hono } from "hono";
import { validator } from "hono/validator";
import Container from "typedi";
import { IPaginate } from "../../common/interfaces/pagination/pagination.interface";
import queryParamMiddleware from "../../common/middlewares/query-param.middleware";
import { FORMAT_DATE_TIME } from "../../common/settings/format-date-time";
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
import GetRoleByIdQuery from "./domain/queries/roles/get-role-by-id.query";
import GetRoleQuery from "./domain/queries/roles/get-role.query";
import { GetRoleByIdDrizzleRepo } from "./drizzle/roles/get-role-by-id.repository";
import { GetRoleDrizzleRepo } from "./drizzle/roles/get-role.repository";
import { RoleSchema } from "./drizzle/schema";
import CreateRoleCase from "./use-cases/roles/create-role.case";
import DeleteRoleCase from "./use-cases/roles/delete-role.case";
import RestoreRoleCase from "./use-cases/roles/restore-role.case";
import UpdateRoleCase from "./use-cases/roles/update-role.case";

const RoleRouter = new Hono();

const getRoleRepo = Container.get(GetRoleDrizzleRepo);
const createRoleCase = Container.get(CreateRoleCase);
const getRoleByIdRepo = Container.get(GetRoleByIdDrizzleRepo);
const updateRoleCase = Container.get(UpdateRoleCase);
const deleteRoleCase = Container.get(DeleteRoleCase);
const restoreRoleCase = Container.get(RestoreRoleCase);

const roleProperties: (keyof RoleSchema)[] = [
  "name",
  "created_at",
  "updated_at",
  "deleted_at",
];

RoleRouter.get(
  "/",
  async (c, next) => await queryParamMiddleware(c, next, roleProperties),
  async ({ req, json }) => {
    const query = req.query() as IPaginate<RoleSchema>;

    const { data, total } = await getRoleRepo.execute(
      new GetRoleQuery({
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
    validator("json", (result) => zodException(CreateRoleDto, result)),
    async ({ req, json }) => {
      const body = req.valid("json") as CreateRoleDtoType;

      const result = await createRoleCase.execute(new CreateRoleCommand(body));

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
  )
  .get(
    "/:id",
    validator("param", (result) => zodException(paramIdSchema, result)),
    async ({ req, json }) => {
      const { id } = req.valid("param");

      const result = await getRoleByIdRepo.execute(
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
  )
  .put(
    "/:id",
    validator("param", (result) => zodException(paramIdSchema, result)),
    validator("json", (result) => zodException(UpdateRoleDto, result)),
    async ({ req, json }) => {
      const body = req.valid("json") as UpdateRoleDtoType;
      const param = req.valid("param");

      const result = await updateRoleCase.execute(
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
  )
  .delete(
    "/:id",
    validator("param", (result) => zodException(paramIdSchema, result)),
    async ({ req, json }) => {
      const { id } = req.valid("param");

      const result = await deleteRoleCase.execute(
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
  )
  .patch(
    "/:id/restore",
    validator("param", (result) => zodException(paramIdSchema, result)),
    async ({ req, json }) => {
      const { id } = req.valid("param");

      const result = await restoreRoleCase.execute(
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

export default RoleRouter;
