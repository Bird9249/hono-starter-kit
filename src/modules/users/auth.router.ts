import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { validator } from "hono/validator";
import { Inject, Service } from "typedi";
import { UnauthorizedException } from "../../common/exception/http";
import authMiddleware from "../../common/middlewares/auth.middleware";
import refreshTokenMiddleware from "../../common/middlewares/refresh-token.middleware";
import { cookieOpts } from "../../common/settings/cookie";
import zodException from "../../common/utils/zod-exception";
import GenerateJoseJwt from "../../infrastructure/jwt/generate-jose-jwt";
import LoginCommand from "./domain/commands/auth/login.command";
import LogoutCommand from "./domain/commands/auth/logout.command";
import RefreshTokenCommand from "./domain/commands/auth/refresh-token.command";
import { LoginDto, LoginDtoType } from "./domain/dtos/auth/login.dto";
import GetUserByIdQuery from "./domain/queries/users/get-user-by-id.query";
import { GetUserByIdDrizzleRepo } from "./drizzle/user/get-user-by-id.repository";
import LoginCase from "./use-cases/auth/login.case";
import LogoutCase from "./use-cases/auth/logout.case";
import RefreshTokenCase from "./use-cases/auth/refresh-token.case";

@Service()
export default class AuthRouter {
  public readonly router: Hono = new Hono();

  constructor(
    @Inject() private readonly _loginCase: LoginCase,
    @Inject() private readonly _logoutCase: LogoutCase,
    @Inject() private readonly _getUserProfile: GetUserByIdDrizzleRepo,
    @Inject() private readonly _refreshTokenCase: RefreshTokenCase,
    @Inject() private readonly _jwt: GenerateJoseJwt
  ) {
    this._login();
    this._logout();
    this._getProfile();
    this._refreshToken();
  }

  private _login() {
    this.router.post(
      "/login",
      validator("json", (result) => zodException(LoginDto, result)),
      async (c) => {
        const body = c.req.valid("json") as LoginDtoType;

        const { access_token, refresh_token, data } =
          await this._loginCase.execute(new LoginCommand(body));

        setCookie(c, "access_token", access_token, cookieOpts);
        setCookie(c, "refresh_token", refresh_token, cookieOpts);

        return c.json(
          {
            id: data.id,
            username: data.username.getValue(),
            email: data.email.getValue(),
            created_at: data.created_at.getValue(),
            updated_at: data.updated_at.getValue(),
          },
          200
        );
      }
    );
  }

  private _getProfile() {
    this.router.get(
      "/profile",
      async (c, next) => await authMiddleware(c, next),
      async (c) => {
        const token = getCookie(c, "access_token");

        if (!token) throw new UnauthorizedException();

        const payload = this._jwt.decode(token);

        const result = await this._getUserProfile.execute(
          new GetUserByIdQuery(Number(payload.sub))
        );

        return c.json(result, 200);
      }
    );
  }

  private _refreshToken() {
    this.router
      .use(
        "/refresh-token",
        async (c, next) => await refreshTokenMiddleware(c, next)
      )
      .get("/refresh-token", async (c) => {
        const token = getCookie(c, "refresh_token");

        if (!token) throw new UnauthorizedException();

        const { access_token, refresh_token, message } =
          await this._refreshTokenCase.execute(new RefreshTokenCommand(token));

        setCookie(c, "access_token", access_token, cookieOpts);
        setCookie(c, "refresh_token", refresh_token, cookieOpts);

        return c.json({ message }, 200);
      });
  }

  private _logout() {
    this.router.post(
      "/logout",
      async (c, next) => await authMiddleware(c, next),
      async (c) => {
        const token = getCookie(c, "access_token");

        if (!token) throw new UnauthorizedException();

        const result = await this._logoutCase.execute(new LogoutCommand(token));

        return c.json({ message: result }, 200);
      }
    );
  }
}
