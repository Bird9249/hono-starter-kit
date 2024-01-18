import { Context, Env, Next } from "hono";
import { getCookie } from "hono/cookie";
import Container from "typedi";
import GenerateJoseJwt from "../../infrastructure/jwt/generate-jose-jwt";
import RemoveSessionCommand from "../../modules/users/domain/commands/auth/remove-session.command";
import { AuthDrizzleRepo } from "../../modules/users/drizzle/auth/auth.repository";
import RemoveSessionCase from "../../modules/users/use-cases/auth/remove-session.case";
import { UnauthorizedException } from "../exception/http";
import UUID from "../value-object/uuid.vo";

export default async function (c: Context<Env, string, {}>, next: Next) {
  const jwt = Container.get(GenerateJoseJwt);
  const repository = Container.get(AuthDrizzleRepo);

  const token = getCookie(c, "access_token");

  if (!token) throw new UnauthorizedException();

  try {
    const payload = await jwt.verify(token);

    const session = await repository.getSession(new UUID(payload.token_id));

    if (!session) throw new UnauthorizedException();

    await next();
  } catch (error) {
    const payload = jwt.decode(token);

    const removeSessionCase = Container.get(RemoveSessionCase);

    await removeSessionCase.execute(new RemoveSessionCommand(payload.token_id));

    throw new UnauthorizedException();
  }
}
