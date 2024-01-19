import Role from "../../entities/role.entity";

export interface IRoleRepository {
  create(entity: Role): Promise<Role>;

  getById(id: number): Promise<Role | void>;

  checkDuplicate(entity: Role): Promise<Role | void>;

  update(entity: Role): Promise<Role>;

  trash(id: number): Promise<Role | void>;
}
