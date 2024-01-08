import { IPaginate } from "../../../../common/interfaces/pagination/pagination.interface";
import User from "../entities/user.entity";

export default class GetUserQuery {
  constructor(public readonly paginate: IPaginate<User>) {}
}
