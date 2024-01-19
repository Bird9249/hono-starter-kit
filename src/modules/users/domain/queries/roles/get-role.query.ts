import { IPaginate } from "../../../../../common/interfaces/pagination/pagination.interface";
import { RoleSchema } from "../../../drizzle/schema";

export default class GetRoleQuery {
  constructor(public readonly paginate: IPaginate<RoleSchema>) {}
}
