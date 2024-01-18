import { Inject, Service } from "typedi";
import { NotFoundException } from "../../../../common/exception/http";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import UpdateUserCommand from "../../domain/commands/users/update-user.command";
import User from "../../domain/entities/user.entity";
import UserFactories from "../../domain/factories/user.factory";
import { UserDrizzleRepo } from "../../drizzle/user/user.repository";

@Service()
export default class UpdateUserCase
  implements ICommandHandler<UpdateUserCommand, User>
{
  constructor(@Inject() private readonly _repository: UserDrizzleRepo) {}

  async execute({ id, dto }: UpdateUserCommand): Promise<User> {
    const oldData = await this._repository.getById(id);

    if (!oldData) {
      throw new NotFoundException("Not Found User!");
    }

    const newDate = new UserFactories().update(oldData, dto);

    return await this._repository.update(newDate);
  }
}
