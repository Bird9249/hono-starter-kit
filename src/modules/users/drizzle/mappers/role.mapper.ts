import Timestamp from "../../../../common/value-object/timestemp.vo";
import Role from "../../domain/entities/role.entity";
import IsDefault from "../../domain/entities/value-object/is-default.vo";
import Name from "../../domain/entities/value-object/name.vo";
import { RoleSchema } from "../schema";

export class RoleMapper {
  toModel(entity: Role): RoleSchema {
    return {
      id: entity.id,
      name: entity.name.getValue(),
      is_default: entity.is_default.getValue(),
      created_at: entity.created_at.getValue(),
      updated_at: entity.updated_at.getValue(),
      deleted_at: entity.deleted_at
        ? entity.deleted_at.getValue()
        : entity.deleted_at,
    };
  }

  toEntity(model: RoleSchema): Role {
    const role = new Role();
    role.id = model.id;
    role.name = Name.create(model.name);
    role.is_default = IsDefault.create(model.is_default);
    role.created_at = new Timestamp(model.created_at);
    role.updated_at = new Timestamp(model.updated_at);
    if (model.deleted_at) role.deleted_at = new Timestamp(model.deleted_at);

    return role;
  }
}
