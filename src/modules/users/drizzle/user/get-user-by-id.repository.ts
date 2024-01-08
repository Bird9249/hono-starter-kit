import { and, eq, isNull } from "drizzle-orm";
import { Inject, Service } from "typedi";
import DrizzleConnection from "../../../../infrastructure/drizzle/connection";
import GetUserByIdQuery from "../../domain/queries/get-user-by-id.query";
import IGetUserByIdRepository from "../../domain/repositories/get-user-by-id.interface";
import { UserType, users } from "../schema";

@Service()
export class GetUserByIdDrizzleRepo implements IGetUserByIdRepository {
  constructor(@Inject() private readonly drizzle: DrizzleConnection) {}

  async execute({ id }: GetUserByIdQuery): Promise<UserType> {
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

    return query[0];
  }
}
