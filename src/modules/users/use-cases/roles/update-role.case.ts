import { Inject, Service } from "typedi";
import {
  NotFoundException,
  UnprocessableContentException,
} from "../../../../common/exception/http";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import UpdateRoleCommand from "../../domain/commands/roles/update-role.command";
import Role from "../../domain/entities/role.entity";
import RoleFactories from "../../domain/factories/role.factory";
import { RoleDrizzleRepo } from "../../drizzle/roles/role.repository";

@Service()
export default class UpdateRoleCase
  implements ICommandHandler<UpdateRoleCommand, Role>
{
  constructor(@Inject() private readonly _repository: RoleDrizzleRepo) {}

  async execute({ id, dto }: UpdateRoleCommand): Promise<Role> {
    const oldData = await this._repository.getById(id);

    if (!oldData) throw new NotFoundException("not found role!");

    const newData = new RoleFactories().update(oldData, dto);

    const existData = await this._repository.checkDuplicate(newData);

    if (existData)
      throw new UnprocessableContentException("this role is duplicate!");

    return await this._repository.update(newData);
  }
}
