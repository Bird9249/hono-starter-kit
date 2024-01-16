import { RoleType } from "../../../drizzle/schema";
import Role from "../../entities/role.entity";
import Name from "../../entities/value-object/name.vo";

export interface IRoleRepository {
  create(role: Role, permissionIds: number[]): Promise<RoleType>;
  
  getRoleByName(name: Name): Promise<RoleType>;
}
