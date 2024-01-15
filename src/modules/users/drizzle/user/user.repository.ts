import { and, eq, isNotNull } from "drizzle-orm";
import { Inject, Service } from "typedi";
import DrizzleConnection from "../../../../infrastructure/drizzle/connection";
import User from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/users/user.interface";
import { UserMapper } from "../mappers/user.mapper";
import { UserType, users } from "../schema";

@Service()
export class UserDrizzleRepo implements IUserRepository {
  private readonly _mapper = new UserMapper();

  constructor(@Inject() private readonly drizzle: DrizzleConnection) {}

  async create(entity: User): Promise<UserType> {
    const res = await this.drizzle.connection
      .insert(users)
      .values(this._mapper.toModel(entity))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    return res[0];
  }

  async update(id: number, entity: User): Promise<UserType> {
    const res = await this.drizzle.connection
      .update(users)
      .set(this._mapper.toModel(entity))
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        username: users.username,
        email: users.email,
        created_at: users.created_at,
        updated_at: users.updated_at,
      });

    return res[0];
  }

  async trash(id?: number | undefined): Promise<UserType | UserType[]> {
    const query = this.drizzle.connection
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .$dynamic();

    if (id) {
      return (
        await query
          .where(and(isNotNull(users.deleted_at), eq(users.id, id)))
          .execute()
      )[0];
    } else {
      return await query.where(isNotNull(users.deleted_at)).execute();
    }
  }
}
