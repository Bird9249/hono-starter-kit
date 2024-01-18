import { Inject, Service } from "typedi";
import { UnprocessableContentException } from "../../../../common/exception/http";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import CreateRoleCommand from "../../domain/commands/roles/create-role.command";
import Role from "../../domain/entities/role.entity";
import Name from "../../domain/entities/value-object/name.vo";
import RoleFactories from "../../domain/factories/role.factory";
import { RoleDrizzleRepo } from "../../drizzle/roles/role.repository";

@Service()
export default class CreateRoleCase
  implements ICommandHandler<CreateRoleCommand, Role>
{
  constructor(@Inject() private readonly _repository: RoleDrizzleRepo) {}

  async execute({ dto }: CreateRoleCommand): Promise<Role> {
    const existRole = await this._repository.checkDuplicate(
      Name.create(dto.name)
    );

    if (existRole) {
      throw new UnprocessableContentException("this role is duplicate!");
    }

    const role = new RoleFactories().create(dto);

    const result = await this._repository.create(
      role,
      role.permissions.map((per) => per.id)
    );

    return result;
  }
}
