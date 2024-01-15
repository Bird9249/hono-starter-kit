import { UserType } from "../../../drizzle/schema";
import User from "../../entities/user.entity";

export interface IUserRepository {
  create(entity: User): Promise<UserType>;

  update(id: number, entity: User): Promise<UserType>;

  trash(id?: number): Promise<UserType | UserType[]>
}
