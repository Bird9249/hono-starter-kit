import Timestamp from "../../../../common/value-object/timestemp.vo";
import UUID from "../../../../common/value-object/uuid.vo";
import Session from "../entities/session.entity";

export default class SessionFactories {
  create(id: UUID, userId: number): Session {
    const session = new Session();
    session.id = id;
    session.user_id = userId;
    session.created_at = Timestamp.create();
    return session;
  }
}
