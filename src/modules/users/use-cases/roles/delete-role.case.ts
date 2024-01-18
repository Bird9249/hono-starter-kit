import { Inject, Service } from "typedi";
import {
  NotFoundException,
  UnprocessableContentException,
} from "../../../../common/exception/http";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import Timestamp from "../../../../common/value-object/timestemp.vo";
import DeleteRoleCommand from "../../domain/commands/roles/delete-role.command";
import Role from "../../domain/entities/role.entity";
import { RoleDrizzleRepo } from "../../drizzle/roles/role.repository";

@Service()
export default class DeleteRoleCase
  implements ICommandHandler<DeleteRoleCommand, Role>
{
  constructor(@Inject() private readonly _repository: RoleDrizzleRepo) {}

  async execute({ id }: DeleteRoleCommand): Promise<Role> {
    const existData = await this._repository.getById(id);

    if (!existData) throw new NotFoundException("Not found this role!");

    if (existData.is_default.getValue())
      throw new UnprocessableContentException("Can not delete role default");

    existData.deleted_at = Timestamp.create();

    return await this._repository.update(existData);
  }
}
