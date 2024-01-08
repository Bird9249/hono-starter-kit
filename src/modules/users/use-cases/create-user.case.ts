import { format } from "date-fns";
import { Inject, Service } from "typedi";
import ICommandHandler from "../../../common/interfaces/cqrs/command.interface";
import CreateUserCommand from "../domain/commands/create-user.command";
import UserFactories from "../domain/factories/user.factory";
import { UserType } from "../drizzle/schema";
import { UserDrizzleRepo } from "../drizzle/user/user.repository";
import { FORMAT_DATE_TIME } from "../../../common/settings/format-date-time";

@Service()
export default class CreateUserCase
  implements ICommandHandler<CreateUserCommand, UserType>
{
  constructor(@Inject() private readonly _repository: UserDrizzleRepo) {}

  async execute({ dto }: CreateUserCommand): Promise<UserType> {
    const user = new UserFactories().create(dto);

    const result = await this._repository.create(user);

    return {
      ...result,
      created_at: format(result.created_at, FORMAT_DATE_TIME),
      updated_at: format(result.updated_at, FORMAT_DATE_TIME),
    };
  }
}
