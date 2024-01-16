import { format } from "date-fns";
import { Inject, Service } from "typedi";
import { UnprocessableContentException } from "../../../../common/exception/http";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import { FORMAT_DATE_TIME } from "../../../../common/settings/format-date-time";
import CreateRoleCommand from "../../domain/commands/roles/create-role.command";
import Name from "../../domain/entities/value-object/name.vo";
import RoleFactories from "../../domain/factories/role.factory";
import { RoleDrizzleRepo } from "../../drizzle/roles/role.repository";
import { RoleType } from "../../drizzle/schema";

@Service()
export default class CreateRoleCase
  implements ICommandHandler<CreateRoleCommand, RoleType>
{
  constructor(@Inject() private readonly _repository: RoleDrizzleRepo) {}

  async execute({ dto }: CreateRoleCommand): Promise<RoleType> {
    const existRole = await this._repository.getRoleByName(
      Name.create(dto.name)
    );

    if (existRole)
      throw new UnprocessableContentException("this role is duplicate!");

    const role = new RoleFactories().create(dto);

    const result = await this._repository.create(
      role,
      role.permissions.map((per) => per.id)
    );

    return {
      ...result,
      created_at: format(result.created_at, FORMAT_DATE_TIME),
      updated_at: format(result.updated_at, FORMAT_DATE_TIME),
    };
  }
}
