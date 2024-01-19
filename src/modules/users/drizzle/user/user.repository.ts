import { and, eq, isNotNull, isNull, not, or } from "drizzle-orm";
import { Inject, Service } from "typedi";
import DrizzleConnection from "../../../../infrastructure/drizzle/connection";
import User from "../../domain/entities/user.entity";
import { IUserRepository } from "../../domain/repositories/users/user.interface";
import { UserMapper } from "../mappers/user.mapper";
import { users, usersToRoles } from "../schema";

@Service()
export class UserDrizzleRepo implements IUserRepository {
  private readonly _mapper = new UserMapper();

  constructor(@Inject() private readonly drizzle: DrizzleConnection) {}

  async create(entity: User): Promise<User> {
    const model = this._mapper.toModel(entity);

    const res = await this.drizzle.connection.transaction(async (tx) => {
      const userRes = await tx.insert(users).values(model).returning();

      await tx.insert(usersToRoles).values(
        entity.roles.map((role) => ({
          role_id: role.id,
          user_id: userRes[0].id,
        }))
      );

      return userRes;
    });

    return this._mapper.toEntity(res[0]);
  }

  async checkDuplicate(entity: User): Promise<void | User> {
    let query = this.drizzle.connection.select().from(users);

    query.where(
      and(
        or(
          eq(users.username, entity.username.getValue()),
          eq(users.email, entity.email.getValue())
        ),
        isNull(users.deleted_at),
        entity.id ? not(eq(users.id, entity.id)) : undefined
      )
    );

    const res = await query.execute();

    if (res.length > 0) return this._mapper.toEntity(res[0]);
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

    const res = await this.drizzle.connection.transaction(async (tx) => {
      const userRes = await tx
        .update(users)
        .set(model)
        .where(eq(users.id, model.id))
        .returning();

      await tx
        .delete(usersToRoles)
        .where(eq(usersToRoles.user_id, userRes[0].id));

      await tx.insert(usersToRoles).values(
        entity.roles.map((role) => ({
          user_id: userRes[0].id,
          role_id: role.id,
        }))
      );

      return userRes;
    });

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
