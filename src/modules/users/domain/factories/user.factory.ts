import { password } from "bun";
import Timestamp from "../../../../common/value-object/timestemp.vo";
import { UserType } from "../../drizzle/schema";
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

  update(dto: UpdateUserDtoType): User {
    const newData = new User();
    newData.username = new Username(dto.username);
    newData.email = new Email(dto.email);
    newData.updated_at = new Timestamp();
    return newData;
  }

  getOne(data: UserType): User {
    const user = new User();
    user.id = data.id;
    user.username = new Username(data.username as string);
    user.email = new Email(data.email);
    return user;
  }
}
