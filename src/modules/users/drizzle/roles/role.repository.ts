import { and, eq, isNull } from "drizzle-orm";
import { Inject, Service } from "typedi";
import DrizzleConnection from "../../../../infrastructure/drizzle/connection";
import Role from "../../domain/entities/role.entity";
import Name from "../../domain/entities/value-object/name.vo";
import { IRoleRepository } from "../../domain/repositories/roles/role.interface";
import { RoleMapper } from "../mappers/role.mapper";
import { RoleType, roles, rolesToPermissions } from "../schema";

@Service()
export class RoleDrizzleRepo implements IRoleRepository {
  private readonly _mapper = new RoleMapper();

  constructor(@Inject() private readonly drizzle: DrizzleConnection) {}

  async create(entity: Role, permissionIds: number[]): Promise<RoleType> {
    const model = this._mapper.toModel(entity);

    const query = await this.drizzle.connection.transaction(async (tx) => {
      const role = await tx.insert(roles).values(model).returning({
        id: roles.id,
        name: roles.name,
        is_default: roles.is_default,
        created_at: roles.created_at,
        updated_at: roles.updated_at,
      });

      await tx.insert(rolesToPermissions).values(
        permissionIds.map((perId) => ({
          role_id: role[0].id,
          permission_id: perId,
        }))
      );

      return role;
    });
    return query[0];
  }

  async getRoleByName(name: Name): Promise<RoleType> {
    const query = await this.drizzle.connection
      .select({
        id: roles.id,
        name: roles.name,
        is_default: roles.is_default,
        created_at: roles.created_at,
        updated_at: roles.updated_at,
      })
      .from(roles)
      .where(and(eq(roles.name, name.getValue()), isNull(roles.deleted_at)))
      .execute();

    return query[0];
  }
}
