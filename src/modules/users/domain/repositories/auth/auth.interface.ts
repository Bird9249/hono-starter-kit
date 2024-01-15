import { SessionType, UserType } from "../../../drizzle/schema";
import Session from "../../entities/session.entity";
import Username from "../../entities/value-object/username.vo";

export default interface IAuthRepository {
  checkUser(username: Username): Promise<UserType>;

  createSession(session: Session): Promise<void>;

  getSession(id: string): Promise<SessionType>;

  removeSession(id: string): Promise<SessionType>
}
