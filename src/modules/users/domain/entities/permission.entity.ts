import Timestamp from "../../../../common/value-object/timestemp.vo";
import Role from "./role.entity";
import Name from "./value-object/name.vo";

export enum PermissionNames {
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
}

export enum PermissionSubject {
  User = "User",
}

export default class Permission {
  id!: number;

  name!: Name;

  display_name!: Name;

  subject_name!: Name;

  subject_display_name!: Name;

  roles!: Role[];

  created_at!: Timestamp;
}
