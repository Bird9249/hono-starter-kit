import IQueryHandler from "../../../../../common/interfaces/cqrs/query.interface";
import {
  PermissionSchema,
  RoleSchema,
  UserSchema,
} from "../../../drizzle/schema";
import GetRoleByIdQuery from "../../queries/roles/get-role-by-id.query";

export interface IGetOneRole extends Partial<RoleSchema> {
  permissions: Partial<PermissionSchema>[];
  users: Partial<UserSchema>[];
}

export default interface IGetRoleByIdRepository
  extends IQueryHandler<GetRoleByIdQuery, IGetOneRole> {}
