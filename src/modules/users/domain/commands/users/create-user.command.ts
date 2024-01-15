import { CreateUserDtoType } from "../../dtos/users/create-user.dto";

export default class CreateUserCommand {
  constructor(public readonly dto: CreateUserDtoType) {
  }
}
