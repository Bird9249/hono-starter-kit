import { Inject, Service } from "typedi";
import { NotFoundException } from "../../../../common/exception/http";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import UUID from "../../../../common/value-object/uuid.vo";
import GenerateJoseJwt from "../../../../infrastructure/jwt/generate-jose-jwt";
import LogoutCommand from "../../domain/commands/auth/logout.command";
import { AuthDrizzleRepo } from "../../drizzle/auth/auth.repository";

@Service()
export default class LogoutCase
  implements ICommandHandler<LogoutCommand, string>
{
  constructor(
    @Inject() private readonly _repository: AuthDrizzleRepo,
    @Inject() private readonly _generateJwt: GenerateJoseJwt
  ) {}

  async execute({ token }: LogoutCommand): Promise<string> {
    const payload = this._generateJwt.decode(token);

    const session = await this._repository.getSession(
      new UUID(payload.token_id)
    );

    if (!session) {
      throw new NotFoundException("Not Found Session!");
    }

    await this._repository.removeSession(session.id);

    return "Logout Successfully";
  }
}
