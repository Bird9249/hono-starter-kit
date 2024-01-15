import { format } from "date-fns";
import { Inject, Service } from "typedi";
import { NotFoundException } from "../../../../common/exception/http";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import { FORMAT_DATE_TIME } from "../../../../common/settings/format-date-time";
import Timestamp from "../../../../common/value-object/timestemp.vo";
import DeleteUserCommand from "../../domain/commands/users/delete-user.command";
import User from "../../domain/entities/user.entity";
import GetUserByIdQuery from "../../domain/queries/users/get-user-by-id.query";
import { UserType } from "../../drizzle/schema";
import { GetUserByIdDrizzleRepo } from "../../drizzle/user/get-user-by-id.repository";
import { UserDrizzleRepo } from "../../drizzle/user/user.repository";

@Service()
export default class DeleteUserCase
  implements ICommandHandler<DeleteUserCommand, UserType>
{
  constructor(
    @Inject() private readonly _repository: UserDrizzleRepo,
    @Inject() private readonly _getUserByIdRepo: GetUserByIdDrizzleRepo
  ) {}

  async execute({ id }: DeleteUserCommand): Promise<UserType> {
    const existUser = await this._getUserByIdRepo.execute(
      new GetUserByIdQuery(id)
    );

    if (!existUser) {
      throw new NotFoundException("Not Found User!");
    }

    const user = new User();
    user.deleted_at = new Timestamp(new Date());

    const result = await this._repository.update(id, user);

    return {
      ...result,
      created_at: format(result.created_at, FORMAT_DATE_TIME),
      updated_at: format(result.updated_at, FORMAT_DATE_TIME),
    };
  }
}
