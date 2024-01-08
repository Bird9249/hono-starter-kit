import { CreateUserDtoType } from "../dtos/create-user.dto";

export default class CreateUserCommand {
  constructor(public readonly dto: CreateUserDtoType) {
  }
}
