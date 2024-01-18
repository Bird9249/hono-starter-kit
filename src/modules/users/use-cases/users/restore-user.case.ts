import { Inject, Service } from "typedi";
import { NotFoundException } from "../../../../common/exception/http";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import RestoreUserCommand from "../../domain/commands/users/restore-user.command";
import User from "../../domain/entities/user.entity";
import { UserDrizzleRepo } from "../../drizzle/user/user.repository";

@Service()
export default class RestoreUserCase
  implements ICommandHandler<RestoreUserCommand, User>
{
  constructor(@Inject() private readonly _repository: UserDrizzleRepo) {}

  async execute({ id }: RestoreUserCommand): Promise<User> {
    const userTrash = await this._repository.trash(id);

    if (!userTrash) throw new NotFoundException("Not Found User!");

    userTrash.deleted_at = null;

    return await this._repository.update(userTrash);
  }
}
