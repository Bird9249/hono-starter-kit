import Timestamp from "../../../../common/value-object/timestemp.vo";
import Permission from "./permission.entity";
import User from "./user.entity";
import IsDefault from "./value-object/is-default.vo";
import Name from "./value-object/name.vo";

export default class Role {
  id!: number;

  name!: Name;

  is_default!: IsDefault;

  users!: User[];

  permissions!: Permission[];

  created_at?: Timestamp;

  updated_at?: Timestamp;

  deleted_at?: Timestamp | null;
}
