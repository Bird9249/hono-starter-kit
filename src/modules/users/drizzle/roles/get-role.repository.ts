import { asc, count, desc, isNull } from "drizzle-orm";
import { Inject, Service } from "typedi";
import { IPaginated } from "../../../../common/interfaces/pagination/paginated.interface";
import DrizzleConnection from "../../../../infrastructure/drizzle/connection";
import GetRoleQuery from "../../domain/queries/roles/get-role.query";
import IGetRoleRepository from "../../domain/repositories/roles/get-role.interface";
import { RoleSchema, roles } from "../schema";

@Service()
export class GetRoleDrizzleRepo implements IGetRoleRepository {
  constructor(@Inject() private readonly drizzle: DrizzleConnection) {}

  async execute({
    paginate: { offset, limit, column, sort_order },
  }: GetRoleQuery): Promise<IPaginated<Partial<RoleSchema>>> {
    const query = this.drizzle.connection
      .select({
        id: roles.id,
        name: roles.name,
        created_at: roles.created_at,
        updated_at: roles.updated_at,
      })
      .from(roles)
      .$dynamic();

    if (limit) {
      query.limit(limit);
    }

    if (offset) {
      query.offset(offset);
    }

    if (sort_order) {
      query.orderBy(
        sort_order === "ASC"
          ? asc(roles[column ? column : "created_at"])
          : desc(roles[column ? column : "created_at"])
      );
    }

    const res = await query.where(isNull(roles.deleted_at)).execute();
    const total = await this.drizzle.connection
      .select({ value: count() })
      .from(roles)
      .where(isNull(roles.deleted_at));

    return {
      data: res,
      total: total[0].value,
    };
  }
}
