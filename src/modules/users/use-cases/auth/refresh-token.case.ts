import { Inject, Service } from "typedi";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import UUID from "../../../../common/value-object/uuid.vo";
import GenerateJoseJwt from "../../../../infrastructure/jwt/generate-jose-jwt";
import { IPayload } from "../../../../infrastructure/jwt/port/generate-jwt.interface";
import RefreshTokenCommand from "../../domain/commands/auth/refresh-token.command";
import SessionFactories from "../../domain/factories/session.factory";
import { AuthDrizzleRepo } from "../../drizzle/auth/auth.repository";

@Service()
export default class RefreshTokenCase
  implements ICommandHandler<RefreshTokenCommand, string>
{
  constructor(
    @Inject() private readonly _generateJwt: GenerateJoseJwt,
    @Inject() private readonly _repository: AuthDrizzleRepo
  ) {}

  async execute({ token }: RefreshTokenCommand): Promise<string> {
    const decode = this._generateJwt.decode(token);

    const token_id = UUID.generate();

    const payload: IPayload = {
      token_id: token_id.getValue(),
      sub: decode.sub,
      name: decode.name,
    };

    const accessToken = await this._generateJwt.sign(payload, {
      duration: "weeks",
      amount: 1,
    });

    const refreshToken = await this._generateJwt.sign(payload, {
      duration: "weeks",
      amount: 2,
    });

    await this._saveSession(Number(decode.sub), token_id);

    return "Refresh token successfully";
  }

  private async _saveSession(userId: number, id: UUID): Promise<void> {
    try {
      const session = new SessionFactories().create(id, userId);

      await this._repository.createSession(session);
    } catch (error) {
      throw error;
    }
  }
}
