import { and, eq, isNull } from "drizzle-orm";
import { Inject, Service } from "typedi";
import UUID from "../../../../common/value-object/uuid.vo";
import DrizzleConnection from "../../../../infrastructure/drizzle/connection";
import Session from "../../domain/entities/session.entity";
import User from "../../domain/entities/user.entity";
import Username from "../../domain/entities/value-object/username.vo";
import IAuthRepository from "../../domain/repositories/auth/auth.interface";
import { SessionMapper } from "../mappers/session.mapper";
import { UserMapper } from "../mappers/user.mapper";
import { sessions, users } from "../schema";

@Service()
export class AuthDrizzleRepo implements IAuthRepository {
  private _mapper = new SessionMapper();
  private readonly _userMapper = new UserMapper();

  constructor(@Inject() private readonly drizzle: DrizzleConnection) {}

  async checkUser(username: Username): Promise<User | void> {
    const query = await this.drizzle.connection
      .select()
      .from(users)
      .where(
        and(eq(users.username, username.getValue()), isNull(users.deleted_at))
      )
      .execute();

    if (query.length > 0) return this._userMapper.toEntity(query[0]);
  }

  async createSession(session: Session): Promise<void> {
    const model = this._mapper.toModel(session);

    await this.drizzle.connection.insert(sessions).values(model).execute();
  }

  async getSession(id: UUID): Promise<Session | void> {
    const query = await this.drizzle.connection
      .select()
      .from(sessions)
      .where(eq(sessions.id, id.getValue()))
      .execute();

    if (query.length > 0) return this._mapper.toEntity(query[0]);
  }

  async removeSession(id: UUID): Promise<Session> {
    const query = await this.drizzle.connection
      .delete(sessions)
      .where(eq(sessions.id, id.getValue()))
      .returning();

    return this._mapper.toEntity(query[0]);
  }
}
