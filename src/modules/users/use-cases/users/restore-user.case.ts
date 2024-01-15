import { format } from "date-fns";
import { Inject, Service } from "typedi";
import { NotFoundException } from "../../../../common/exception/http";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import { FORMAT_DATE_TIME } from "../../../../common/settings/format-date-time";
import Timestamp from "../../../../common/value-object/timestemp.vo";
import RestoreUserCommand from "../../domain/commands/users/restore-user.command";
import UserFactories from "../../domain/factories/user.factory";
import { UserType } from "../../drizzle/schema";
import { UserDrizzleRepo } from "../../drizzle/user/user.repository";

@Service()
export default class RestoreUserCase
  implements ICommandHandler<RestoreUserCommand, UserType>
{
  constructor(@Inject() private readonly _repository: UserDrizzleRepo) {}

  async execute({ id }: RestoreUserCommand): Promise<UserType> {
    const res = (await this._repository.trash(id)) as UserType;

    if (!res) {
      throw new NotFoundException("Not Found User!");
    }

    const user = new UserFactories().getOne(res);

    user.deleted_at = new Timestamp(null);

    const result = await this._repository.update(id, user);

    return {
      ...result,
      created_at: format(result.created_at, FORMAT_DATE_TIME),
      updated_at: format(result.updated_at, FORMAT_DATE_TIME),
    };
  }
}
