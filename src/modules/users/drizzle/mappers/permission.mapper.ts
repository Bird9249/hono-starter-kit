import Timestamp from "../../../../common/value-object/timestemp.vo";
import Permission from "../../domain/entities/permission.entity";
import Name from "../../domain/entities/value-object/name.vo";
import { PermissionSchema } from "../schema";

export class PermissionMapper {
  toModel(entity: Permission): PermissionSchema {
    return {
      id: entity.id,
      name: entity.name.getValue(),
      display_name: entity.display_name.getValue(),
      subject_name: entity.subject_name.getValue(),
      subject_display_name: entity.subject_display_name.getValue(),
      created_at: entity.created_at.getValue(),
    };
  }

  toEntity(model: PermissionSchema): Permission {
    const permission = new Permission();
    permission.id = model.id;
    permission.name = Name.create(model.name);
    permission.display_name = Name.create(model.display_name);
    permission.subject_name = Name.create(model.subject_name);
    permission.subject_display_name = Name.create(model.subject_display_name);
    permission.created_at = new Timestamp(model.created_at);
    return permission;
  }
}
