import User from "../../entities/user.entity";

export interface IUserRepository {
  create(entity: User): Promise<User>;

  getById(id: number): Promise<User | void>;

  update(entity: User): Promise<User>;

  trash(id?: number): Promise<User | void>;
}
