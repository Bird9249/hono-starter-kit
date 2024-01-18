import { and, eq, isNull, not } from "drizzle-orm";
import { Inject, Service } from "typedi";
import DrizzleConnection from "../../../../infrastructure/drizzle/connection";
import Role from "../../domain/entities/role.entity";
import Name from "../../domain/entities/value-object/name.vo";
import { IRoleRepository } from "../../domain/repositories/roles/role.interface";
import { PermissionMapper } from "../mappers/permission.mapper";
import { RoleMapper } from "../mappers/role.mapper";
import { permissions, roles, rolesToPermissions } from "../schema";

@Service()
export class RoleDrizzleRepo implements IRoleRepository {
  private readonly _mapper = new RoleMapper();
  private readonly _permissionMapper = new PermissionMapper();

  constructor(@Inject() private readonly drizzle: DrizzleConnection) {}

  async create(entity: Role, permissionIds: number[]): Promise<Role> {
    const model = this._mapper.toModel(entity);

    const query = await this.drizzle.connection.transaction(async (tx) => {
      const roleRes = await tx.insert(roles).values(model).returning();

      await tx.insert(rolesToPermissions).values(
        permissionIds.map((perId) => ({
          role_id: roleRes[0].id,
          permission_id: perId,
        }))
      );

      return roleRes;
    });

    return this._mapper.toEntity(query[0]);
  }

  async checkDuplicate(
    name: Name,
    id?: number | undefined
  ): Promise<Role | void> {
    let query = this.drizzle.connection
      .select()
      .from(roles)
      .leftJoin(rolesToPermissions, eq(roles.id, rolesToPermissions.role_id))
      .innerJoin(
        permissions,
        eq(rolesToPermissions.permission_id, permissions.id)
      );

    if (!id) {
      query.where(
        and(eq(roles.name, name.getValue()), isNull(roles.deleted_at))
      );
    } else {
      query.where(
        and(
          eq(roles.name, name.getValue()),
          isNull(roles.deleted_at),
          not(eq(roles.id, id))
        )
      );
    }

    const res = await query.execute();

    if (res.length > 0) {
      const role = this._mapper.toEntity(res[0].roles);
      role.permissions = res.map((res) =>
        this._permissionMapper.toEntity(res.permissions)
      );

      return role;
    }
  }

  async getById(id: number): Promise<void | Role> {
    let res = await this.drizzle.connection
      .select()
      .from(roles)
      .leftJoin(rolesToPermissions, eq(roles.id, rolesToPermissions.role_id))
      .innerJoin(
        permissions,
        eq(rolesToPermissions.permission_id, permissions.id)
      )
      .where(and(eq(roles.id, id), isNull(roles.deleted_at)))
      .execute();

    if (res.length > 0) {
      const role = this._mapper.toEntity(res[0].roles);
      role.permissions = res.map((res) =>
        this._permissionMapper.toEntity(res.permissions)
      );

      return role;
    }
  }

  async update(entity: Role, permissionIds?: number[]): Promise<Role> {
    const model = this._mapper.toModel(entity);

    const res = await this.drizzle.connection.transaction(async (tx) => {
      const roleRes = await tx
        .update(roles)
        .set(model)
        .where(eq(roles.id, entity.id))
        .returning();

      if (permissionIds) {
        await tx
          .delete(rolesToPermissions)
          .where(eq(rolesToPermissions.role_id, roleRes[0].id));

        await tx.insert(rolesToPermissions).values(
          permissionIds.map((perId) => ({
            role_id: roleRes[0].id,
            permission_id: perId,
          }))
        );
      }

      return roleRes;
    });

    return this._mapper.toEntity(res[0]);
  }
}
