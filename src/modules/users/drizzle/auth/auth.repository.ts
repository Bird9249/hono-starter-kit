import { and, eq, isNull } from "drizzle-orm";
import { Inject, Service } from "typedi";
import DrizzleConnection from "../../../../infrastructure/drizzle/connection";
import Session from "../../domain/entities/session.entity";
import Username from "../../domain/entities/value-object/username.vo";
import IAuthRepository from "../../domain/repositories/auth/auth.interface";
import { SessionMapper } from "../mappers/session.mapper";
import { SessionType, UserType, sessions, users } from "../schema";

@Service()
export class AuthDrizzleRepo implements IAuthRepository {
  private _mapper = new SessionMapper();

  constructor(@Inject() private readonly drizzle: DrizzleConnection) {}

  async checkUser(username: Username): Promise<UserType> {
    const query = await this.drizzle.connection
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        password: users.password,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(
        and(eq(users.username, username.getValue), isNull(users.deleted_at))
      )
      .execute();

    return query[0];
  }

  async createSession(session: Session): Promise<void> {
    const model = this._mapper.toModel(session);

    await this.drizzle.connection.insert(sessions).values(model).execute();
  }

  async getSession(id: string): Promise<SessionType> {
    const query = await this.drizzle.connection
      .select()
      .from(sessions)
      .where(eq(sessions.id, id))
      .execute();

    return query[0];
  }

  async removeSession(id: string): Promise<SessionType> {
    const query = await this.drizzle.connection
      .delete(sessions)
      .where(eq(sessions.id, id))
      .returning();

    return query[0];
  }
}
