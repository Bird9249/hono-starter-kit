import Timestamp from "../../../../common/value-object/timestemp.vo";
import { CreateRoleDtoType } from "../dtos/roles/create-role.dto";
import Permission from "../entities/permission.entity";
import Role from "../entities/role.entity";
import IsDefault from "../entities/value-object/is-default.vo";
import Name from "../entities/value-object/name.vo";

export default class RoleFactories {
  create(dto: CreateRoleDtoType): Role {
    const newData = new Role();
    newData.name = Name.create(dto.name);
    newData.is_default = IsDefault.create(false);
    newData.permissions = dto.permission_ids.map((perId) => {
      const permission = new Permission();
      permission.id = perId;
      return permission;
    });
    newData.created_at = new Timestamp();
    newData.updated_at = new Timestamp();
    return newData;
  }
}
