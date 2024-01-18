import { and, eq, isNull } from "drizzle-orm";
import { Inject, Service } from "typedi";
import { NotFoundException } from "../../../../common/exception/http";
import DrizzleConnection from "../../../../infrastructure/drizzle/connection";
import GetUserByIdQuery from "../../domain/queries/users/get-user-by-id.query";
import IGetUserByIdRepository from "../../domain/repositories/users/get-user-by-id.interface";
import { UserSchema, users } from "../schema";

@Service()
export class GetUserByIdDrizzleRepo implements IGetUserByIdRepository {
  constructor(@Inject() private readonly drizzle: DrizzleConnection) {}

  async execute({ id }: GetUserByIdQuery): Promise<Partial<UserSchema>> {
    const query = await this.drizzle.connection
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deleted_at)))
      .execute();

    if (query.length <= 0) {
      throw new NotFoundException();
    }

    return query[0];
  }
}
