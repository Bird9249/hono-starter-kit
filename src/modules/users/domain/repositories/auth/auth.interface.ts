import UUID from "../../../../../common/value-object/uuid.vo";
import Session from "../../entities/session.entity";
import User from "../../entities/user.entity";
import Username from "../../entities/value-object/username.vo";

export default interface IAuthRepository {
  checkUser(username: Username): Promise<User | void>;

  createSession(session: Session): Promise<void>;

  getSession(id: UUID): Promise<Session | void>;

  removeSession(id: UUID): Promise<Session>;
}
