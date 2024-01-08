import User from "../../domain/entities/user.entity";
import { InsertUserType } from "../schema";

export class UserMapper {
  toModel(entity: User): InsertUserType {
    return {
      username: entity.username.getValue,
      email: entity.email.getValue,
      password: entity.password?.getValue as string,
      updated_at: entity.updated_at?.getValue as string,
      deleted_at:
        entity.deleted_at?.getValue !== undefined
          ? entity.deleted_at?.getValue
          : undefined,
    };
  }
}
