import { asc, count, desc, isNull } from "drizzle-orm";
import { Inject, Service } from "typedi";
import { IPaginated } from "../../../../common/interfaces/pagination/paginated.interface";
import DrizzleConnection from "../../../../infrastructure/drizzle/connection";
import GetUserQuery from "../../domain/queries/users/get-user.query";
import IGetUserRepository from "../../domain/repositories/users/get-user.interface";
import { UserType, users } from "../schema";

@Service()
export class GetUserDrizzleRepo implements IGetUserRepository {
  constructor(@Inject() private readonly drizzle: DrizzleConnection) {}

  async execute({
    paginate: { offset, limit, column, sort_order },
  }: GetUserQuery): Promise<IPaginated<UserType>> {
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

    if (limit) {
      query.limit(limit);
    }

    if (offset) {
      query.offset(offset);
    }

    if (sort_order && !column) {
      if (sort_order === "ASC") {
        query.orderBy(asc(users["created_at"]));
      }
      if (sort_order === "DESC") {
        query.orderBy(desc(users["created_at"]));
      }
    }

    if (sort_order && column) {
      if (sort_order === "ASC") {
        query.orderBy(asc(users[column]));
      }
      if (sort_order === "DESC") {
        query.orderBy(desc(users[column]));
      }
    }

    const res = await query.where(isNull(users.deleted_at)).execute();
    const total = await this.drizzle.connection
      .select({ value: count() })
      .from(users)
      .where(isNull(users.deleted_at));

    return {
      data: res,
      total: total[0].value,
    };
  }
}
