import Timestamp from "../../../../common/value-object/timestemp.vo";
import UUID from "../../../../common/value-object/uuid.vo";
import User from "./user.entity";

export default class Session {
  id!: UUID;

  user_id!: number;

  user!: User;

  created_at?: Timestamp;
}
