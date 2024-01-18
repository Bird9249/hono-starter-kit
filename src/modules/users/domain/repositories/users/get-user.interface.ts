import IQueryHandler from "../../../../../common/interfaces/cqrs/query.interface";
import { IPaginated } from "../../../../../common/interfaces/pagination/paginated.interface";
import { UserSchema } from "../../../drizzle/schema";
import GetUserQuery from "../../queries/users/get-user.query";

export default interface IGetUserRepository
  extends IQueryHandler<GetUserQuery, IPaginated<Partial<UserSchema>>> {}
