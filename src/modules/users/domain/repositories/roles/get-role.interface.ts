import IQueryHandler from "../../../../../common/interfaces/cqrs/query.interface";
import { IPaginated } from "../../../../../common/interfaces/pagination/paginated.interface";
import { RoleSchema } from "../../../drizzle/schema";
import GetRoleQuery from "../../queries/roles/get-role.query";

export default interface IGetRoleRepository
  extends IQueryHandler<GetRoleQuery, IPaginated<Partial<RoleSchema>>> {}
