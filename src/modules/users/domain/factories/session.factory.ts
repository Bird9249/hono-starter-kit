import UUID from "../../../../common/value-object/uuid.vo";
import Session from "../entities/session.entity";

export default class SessionFactories {
  create(id: UUID, userId: number): Session {
    const session = new Session();
    session.id = id;
    session.user_id = userId;
    return session;
  }
}
