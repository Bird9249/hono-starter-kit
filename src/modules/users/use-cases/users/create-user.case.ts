import { Inject, Service } from "typedi";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import CreateUserCommand from "../../domain/commands/users/create-user.command";
import User from "../../domain/entities/user.entity";
import UserFactories from "../../domain/factories/user.factory";
import { UserDrizzleRepo } from "../../drizzle/user/user.repository";

@Service()
export default class CreateUserCase
  implements ICommandHandler<CreateUserCommand, User>
{
  constructor(@Inject() private readonly _repository: UserDrizzleRepo) {}

  async execute({ dto }: CreateUserCommand): Promise<User> {
    const user = new UserFactories().create(dto);

    const result = await this._repository.create(user);

    return result;
  }
}
