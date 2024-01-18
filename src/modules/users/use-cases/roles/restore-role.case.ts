import { Inject, Service } from "typedi";
import { NotFoundException } from "../../../../common/exception/http";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import RestoreRoleCommand from "../../domain/commands/roles/restore-role.command";
import Role from "../../domain/entities/role.entity";
import { RoleDrizzleRepo } from "../../drizzle/roles/role.repository";

@Service()
export default class RestoreRoleCase
  implements ICommandHandler<RestoreRoleCommand, Role>
{
  constructor(@Inject() private readonly _repository: RoleDrizzleRepo) {}

  async execute({ id }: RestoreRoleCommand): Promise<Role> {
    const dataTrash = await this._repository.trash(id);

    if (!dataTrash) throw new NotFoundException("Not found role in trash!");

    dataTrash.deleted_at = null;

    return await this._repository.update(dataTrash);
  }
}
