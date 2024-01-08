import Timestamp from "../../../../common/value-object/timestemp.vo";
import Email from "./value-object/email.vo";
import Password from "./value-object/password.vo";
import Username from "./value-object/username.vo";

export default class User {
  id!: number;

  username!: Username;

  email!: Email;

  password!: Password;

  created_at?: Timestamp;

  updated_at?: Timestamp;

  deleted_at?: Timestamp | null;
}