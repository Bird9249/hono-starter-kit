import { IPaginate } from "../../../../../common/interfaces/pagination/pagination.interface";
import { UserSchema } from "../../../drizzle/schema";

export default class GetUserQuery {
  constructor(public readonly paginate: IPaginate<UserSchema>) {}
}
