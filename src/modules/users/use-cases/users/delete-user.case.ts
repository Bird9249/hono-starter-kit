import { Inject, Service } from "typedi";
import { NotFoundException } from "../../../../common/exception/http";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import Timestamp from "../../../../common/value-object/timestemp.vo";
import DeleteUserCommand from "../../domain/commands/users/delete-user.command";
import User from "../../domain/entities/user.entity";
import { UserDrizzleRepo } from "../../drizzle/user/user.repository";

@Service()
export default class DeleteUserCase
  implements ICommandHandler<DeleteUserCommand, User>
{
  constructor(@Inject() private readonly _repository: UserDrizzleRepo) {}

  async execute({ id }: DeleteUserCommand): Promise<User> {
    const user = await this._repository.getById(id);

    if (!user) throw new NotFoundException("Not Found User!");

    user.deleted_at = Timestamp.create(new Date());

    return await this._repository.update(user);
  }
}
