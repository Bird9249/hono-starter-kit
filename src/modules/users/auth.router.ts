import { Hono } from "hono";
import { validator } from "hono/validator";
import { Inject, Service } from "typedi";
import authMiddleware from "../../common/middlewares/auth.middleware";
import refreshTokenMiddleware from "../../common/middlewares/refresh-token.middleware";
import zodException from "../../common/utils/zod-exception";
import GenerateJoseJwt from "../../infrastructure/jwt/generate-jose-jwt";
import LoginCommand from "./domain/commands/auth/login.command";
import LogoutCommand from "./domain/commands/auth/logout.command";
import RefreshTokenCommand from "./domain/commands/auth/refresh-token.command";
import { LoginDto, LoginDtoType } from "./domain/dtos/auth/login.dto";
import { LogoutDto, LogoutDtoType } from "./domain/dtos/auth/logout.dto";
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
      async ({ req, json }) => {
        const body = req.valid("json") as LoginDtoType;

        const result = await this._loginCase.execute(new LoginCommand(body));

        return json(result, 200);
      }
    );
  }

  private _getProfile() {
    this.router
      .use("/profile", async (c, next) => await authMiddleware(c, next))
      .get("/profile", async ({ req, json }) => {
        const header = req.header();

        const token = header["authorization"].split(" ")[1];

        const payload = this._jwt.decode(token);

        const result = await this._getUserProfile.execute(
          new GetUserByIdQuery(Number(payload.sub))
        );

        return json(result, 200);
      });
  }

  private _refreshToken() {
    this.router
      .use(
        "/refresh-token",
        async (c, next) => await refreshTokenMiddleware(c, next)
      )
      .get("/refresh-token", async ({ req, json }) => {
        const header = req.header();
        const token = header["authorization"].split(" ")[1];

        const result = await this._refreshTokenCase.execute(
          new RefreshTokenCommand(token)
        );

        return json(result, 200);
      });
  }

  private _logout() {
    this.router
      .use("/logout", async (c, next) => await authMiddleware(c, next))
      .post(
        "/logout",
        validator("header", (result) => zodException(LogoutDto, result)),
        async ({ req, json }) => {
          const header = req.valid("header") as LogoutDtoType;
          const token = header.authorization.split(" ");

          const result = await this._logoutCase.execute(
            new LogoutCommand({ authorization: token[1] })
          );

          return json({ message: result }, 200);
        }
      );
  }
}
