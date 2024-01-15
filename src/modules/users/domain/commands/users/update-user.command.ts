import { UpdateUserDtoType } from "../../dtos/users/update-user.dto";

export default class UpdateUserCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateUserDtoType
  ) {}
}
