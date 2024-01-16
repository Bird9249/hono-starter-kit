import Role from "../../domain/entities/role.entity";
import { InsertRoleType } from "../schema";

export class RoleMapper {
  toModel(entity: Role): InsertRoleType {
    return {
      name: entity.name.getValue(),
      is_default: entity.is_default.getValue(),
      updated_at: entity.updated_at?.getValue as string,
      deleted_at:
        entity.deleted_at?.getValue !== undefined
          ? entity.deleted_at?.getValue
          : undefined,
    };
  }
}
