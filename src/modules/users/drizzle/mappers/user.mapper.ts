import Timestamp from "../../../../common/value-object/timestemp.vo";
import User from "../../domain/entities/user.entity";
import Email from "../../domain/entities/value-object/email.vo";
import Password from "../../domain/entities/value-object/password.vo";
import Username from "../../domain/entities/value-object/username.vo";
import { UserSchema } from "../schema";

export class UserMapper {
  toModel(entity: User): UserSchema {
    return {
      id: entity.id,
      username: entity.username.getValue(),
      email: entity.email.getValue(),
      password: entity.password.getValue(),
      created_at: entity.created_at.getValue(),
      updated_at: entity.updated_at.getValue(),
      deleted_at: entity.deleted_at
        ? entity.deleted_at.getValue()
        : entity.deleted_at,
    };
  }

  toEntity(model: UserSchema): User {
    const entity = new User();
    entity.id = model.id;
    entity.username = Username.create(model.username);
    entity.email = Email.create(model.email);
    entity.password = Password.create(model.password);
    entity.created_at = new Timestamp(model.created_at);
    entity.updated_at = new Timestamp(model.updated_at);
    if (model.deleted_at) entity.deleted_at = new Timestamp(model.deleted_at);
    return entity;
  }
}
