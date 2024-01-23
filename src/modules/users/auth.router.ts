import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { validator } from "hono/validator";
import Container from "typedi";
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

const AuthRouter = new Hono();

const loginCase = Container.get(LoginCase);
const logoutCase = Container.get(LogoutCase);
const getUserByIdRepo = Container.get(GetUserByIdDrizzleRepo);
const refreshTokenCase = Container.get(RefreshTokenCase);
const jwt = Container.get(GenerateJoseJwt);

AuthRouter.post(
  "/login",
  validator("json", (result) => zodException(LoginDto, result)),
  async (c) => {
    const body = c.req.valid("json") as LoginDtoType;

    const { access_token, refresh_token, data } = await loginCase.execute(
      new LoginCommand(body)
    );

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
)
  .get(
    "/profile",
    async (c, next) => await authMiddleware(c, next),
    async (c) => {
      const token = getCookie(c, "access_token");

      if (!token) throw new UnauthorizedException();

      const payload = jwt.decode(token);

      const result = await getUserByIdRepo.execute(
        new GetUserByIdQuery(Number(payload.sub))
      );

      return c.json(result, 200);
    }
  )
  .get(
    "/refresh-token",
    async (c, next) => await refreshTokenMiddleware(c, next),
    async (c) => {
      const token = getCookie(c, "refresh_token");

      if (!token) throw new UnauthorizedException();

      const { access_token, refresh_token, message } =
        await refreshTokenCase.execute(new RefreshTokenCommand(token));

      setCookie(c, "access_token", access_token, cookieOpts);
      setCookie(c, "refresh_token", refresh_token, cookieOpts);

      return c.json({ message }, 200);
    }
  )
  .post(
    "/logout",
    async (c, next) => await authMiddleware(c, next),
    async (c) => {
      const token = getCookie(c, "access_token");

      if (!token) throw new UnauthorizedException();

      const result = await logoutCase.execute(new LogoutCommand(token));

      return c.json({ message: result }, 200);
    }
  );

export default AuthRouter;
