import { and, eq, isNotNull, isNull } from "drizzle-orm";
import { Inject, Service } from "typedi";
import DrizzleConnection from "../../../../infrastructure/drizzle/connection";
import User from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/users/user.interface";
import { UserMapper } from "../mappers/user.mapper";
import { users } from "../schema";

@Service()
export class UserDrizzleRepo implements IUserRepository {
  private readonly _mapper = new UserMapper();

  constructor(@Inject() private readonly drizzle: DrizzleConnection) {}

  async create(entity: User): Promise<User> {
    const model = this._mapper.toModel(entity);

    const res = await this.drizzle.connection
      .insert(users)
      .values(model)
      .returning();

    return this._mapper.toEntity(res[0]);
  }

  async getById(id: number): Promise<void | User> {
    let res = await this.drizzle.connection
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deleted_at)))
      .execute();

    if (res.length > 0) {
      return this._mapper.toEntity(res[0]);
    }
  }

  async update(entity: User): Promise<User> {
    const model = this._mapper.toModel(entity);

    const res = await this.drizzle.connection
      .update(users)
      .set(model)
      .where(eq(users.id, model.id))
      .returning();

    return this._mapper.toEntity(res[0]);
  }

  async trash(id: number): Promise<User | void> {
    const res = await this.drizzle.connection
      .select()
      .from(users)
      .where(and(isNotNull(users.deleted_at), eq(users.id, id)))
      .execute();

    if (res.length > 0) return this._mapper.toEntity(res[0]);
  }
}
