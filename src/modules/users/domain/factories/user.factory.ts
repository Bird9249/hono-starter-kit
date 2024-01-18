import { password } from "bun";
import Timestamp from "../../../../common/value-object/timestemp.vo";
import { CreateUserDtoType } from "../dtos/users/create-user.dto";
import { UpdateUserDtoType } from "../dtos/users/update-user.dto";
import User from "../entities/user.entity";
import Email from "../entities/value-object/email.vo";
import Password from "../entities/value-object/password.vo";
import Username from "../entities/value-object/username.vo";

export default class UserFactories {
  create(dto: CreateUserDtoType): User {
    const newData = new User();
    newData.username = new Username(dto.username);
    newData.email = new Email(dto.email);
    newData.password = new Password(password.hashSync(dto.password));
    newData.created_at = new Timestamp();
    newData.updated_at = new Timestamp();
    return newData;
  }

  update(entity: User, dto: UpdateUserDtoType): User {
    entity.username = new Username(dto.username);
    entity.email = new Email(dto.email);
    entity.updated_at = new Timestamp();
    return entity;
  }
}
