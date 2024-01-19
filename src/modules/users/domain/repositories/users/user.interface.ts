import User from "../../entities/user.entity";

export interface IUserRepository {
  create(entity: User): Promise<User>;

  checkDuplicate(entity: User): Promise<User | void>;

  getById(id: number): Promise<User | void>;

  update(entity: User): Promise<User>;

  trash(id?: number): Promise<User | void>;
}
