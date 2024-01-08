import IQueryHandler from "../../../../common/interfaces/cqrs/query.interface";
import { UserType } from "../../drizzle/schema";
import GetUserByIdQuery from "../queries/get-user-by-id.query";

export default interface IGetUserByIdRepository
  extends IQueryHandler<GetUserByIdQuery, UserType> {}
