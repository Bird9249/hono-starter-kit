import { password } from "bun";
import { Inject, Service } from "typedi";
import { UnauthorizedException } from "../../../../common/exception/http";
import ICommandHandler from "../../../../common/interfaces/cqrs/command.interface";
import UUID from "../../../../common/value-object/uuid.vo";
import GenerateJoseJwt from "../../../../infrastructure/jwt/generate-jose-jwt";
import { IPayload } from "../../../../infrastructure/jwt/port/generate-jwt.interface";
import LoginCommand from "../../domain/commands/auth/login.command";
import { LoginDtoType } from "../../domain/dtos/auth/login.dto";
import User from "../../domain/entities/user.entity";
import Username from "../../domain/entities/value-object/username.vo";
import SessionFactories from "../../domain/factories/session.factory";
import { AuthDrizzleRepo } from "../../drizzle/auth/auth.repository";

@Service()
export default class LoginCase
  implements
    ICommandHandler<
      LoginCommand,
      { access_token: string; refresh_token: string; data: User }
    >
{
  constructor(
    @Inject() private readonly _repository: AuthDrizzleRepo,
    @Inject() private readonly _generateJwt: GenerateJoseJwt
  ) {}

  async execute({ dto }: LoginCommand): Promise<{
    access_token: string;
    refresh_token: string;
    data: User;
  }> {
    const user = await this._checkUser(dto);

    const token_id = UUID.generate();

    const payload: IPayload = {
      token_id: token_id.getValue(),
      sub: String(user.id),
      name: user.username.getValue(),
    };

    const accessToken = await this._generateJwt.sign(payload, {
      duration: "weeks",
      amount: 1,
    });

    const refreshToken = await this._generateJwt.sign(payload, {
      duration: "weeks",
      amount: 2,
    });

    await this._saveSession(user.id, token_id);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      data: user,
    };
  }

  private async _checkUser(dto: LoginDtoType): Promise<User> {
    const user = await this._repository.checkUser(new Username(dto.username));

    if (!user || !password.verifySync(dto.password, user.password.getValue()))
      throw new UnauthorizedException(
        "Invalid username or password. Please check your credentials."
      );

    return user;
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
