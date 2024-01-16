import Timestamp from "../../../../common/value-object/timestemp.vo";
import Role from "./role.entity";
import DisplayName from "./value-object/display-name.vo";
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

  name!: Name | PermissionNames;

  display_name!: DisplayName;

  subject_name!: Name | PermissionSubject;

  subject_display_name!: Name;

  roles?: Role[];

  created_at?: Timestamp;
}
