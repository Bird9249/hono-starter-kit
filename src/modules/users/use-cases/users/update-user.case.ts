import { format } from "date-fns";
import { Inject, Service } from "typedi";
import { NotFoundException } from "../../../../common/exception/http";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import { FORMAT_DATE_TIME } from "../../../../common/settings/format-date-time";
import UpdateUserCommand from "../../domain/commands/users/update-user.command";
import UserFactories from "../../domain/factories/user.factory";
import GetUserByIdQuery from "../../domain/queries/users/get-user-by-id.query";
import { UserType } from "../../drizzle/schema";
import { GetUserByIdDrizzleRepo } from "../../drizzle/user/get-user-by-id.repository";
import { UserDrizzleRepo } from "../../drizzle/user/user.repository";

@Service()
export default class UpdateUserCase
  implements ICommandHandler<UpdateUserCommand, UserType>
{
  constructor(
    @Inject() private readonly _repository: UserDrizzleRepo,
    @Inject() private readonly _getUserByIdRepo: GetUserByIdDrizzleRepo
  ) {}

  async execute({ id, dto }: UpdateUserCommand): Promise<UserType> {
    const existUser = await this._getUserByIdRepo.execute(
      new GetUserByIdQuery(id)
    );

    if (!existUser) {
      throw new NotFoundException("Not Found User!");
    }

    const newDate = new UserFactories().update(dto);

    const result = await this._repository.update(id, newDate);

    return {
      ...result,
      created_at: format(result.created_at, FORMAT_DATE_TIME),
      updated_at: format(result.updated_at, FORMAT_DATE_TIME),
    };
  }
}
