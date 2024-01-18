import Role from "../../entities/role.entity";
import Name from "../../entities/value-object/name.vo";

export interface IRoleRepository {
  create(entity: Role, permissionIds: number[]): Promise<Role>;

  getById(id: number): Promise<Role | void>;

  checkDuplicate(name: Name, id?: number): Promise<Role | void>;

  update(entity: Role, permissionIds?: number[]): Promise<Role>;

  trash(id: number): Promise<Role | void>
}
