import { format } from "date-fns";
import { and, eq, isNull } from "drizzle-orm";
import { Inject, Service } from "typedi";
import { NotFoundException } from "../../../../common/exception/http";
import { FORMAT_DATE_TIME } from "../../../../common/settings/format-date-time";
import DrizzleConnection from "../../../../infrastructure/drizzle/connection";
import GetRoleByIdQuery from "../../domain/queries/roles/get-role-by-id.query";
import IGetRoleByIdRepository, {
  IGetOneRole,
} from "../../domain/repositories/roles/get-role-by-id.interface";
import {
  permissions,
  roles,
  rolesToPermissions,
  users,
  usersToRoles,
} from "../schema";

@Service()
export class GetRoleByIdDrizzleRepo implements IGetRoleByIdRepository {
  constructor(@Inject() private readonly drizzle: DrizzleConnection) {}

  async execute({ id }: GetRoleByIdQuery): Promise<IGetOneRole> {
    const query = await this.drizzle.connection
      .select({
        id: roles.id,
        name: roles.name,
        created_at: roles.created_at,
        updated_at: roles.updated_at,
        permissions: {
          id: permissions.id,
          name: permissions.name,
          display_name: permissions.display_name,
          subject_name: permissions.subject_name,
          subject_display_name: permissions.subject_display_name,
          created_at: permissions.created_at,
        },
        users: {
          id: users.id,
          username: users.username,
          email: users.email,
          created_at: users.created_at,
          updated_at: users.updated_at,
        },
      })
      .from(roles)
      .leftJoin(rolesToPermissions, eq(roles.id, rolesToPermissions.role_id))
      .leftJoin(
        permissions,
        eq(rolesToPermissions.permission_id, permissions.id)
      )
      .leftJoin(usersToRoles, eq(roles.id, usersToRoles.role_id))
      .leftJoin(users, eq(usersToRoles.user_id, users.id))
      .where(and(eq(roles.id, id), isNull(roles.deleted_at)))
      .execute();

    if (query.length <= 0) {
      throw new NotFoundException();
    }

    const results: IGetOneRole = {
      ...query[0],
      created_at: format(query[0].created_at, FORMAT_DATE_TIME),
      updated_at: format(query[0].updated_at, FORMAT_DATE_TIME),
      permissions: [],
      users: [],
    };

    query.forEach((v) => {
      if (v.permissions)
        results.permissions.push({
          ...v.permissions,
          created_at: format(v.permissions.created_at, FORMAT_DATE_TIME),
        });

      if (v.users)
        results.users.push({
          ...v.users,
          created_at: format(v.users.created_at, FORMAT_DATE_TIME),
          updated_at: format(v.users.updated_at, FORMAT_DATE_TIME),
        });
    });

    return results;
  }
}
