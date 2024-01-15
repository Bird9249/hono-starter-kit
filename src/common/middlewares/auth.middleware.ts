import { Context, Env, Next } from "hono";
import Container from "typedi";
import GenerateJoseJwt from "../../infrastructure/jwt/generate-jose-jwt";
import RemoveSessionCommand from "../../modules/users/domain/commands/auth/remove-session.command";
import { AuthDrizzleRepo } from "../../modules/users/drizzle/auth/auth.repository";
import RemoveSessionCase from "../../modules/users/use-cases/auth/remove-session.case";
import { UnauthorizedException } from "../exception/http";

export default async function ({ req }: Context<Env, string, {}>, next: Next) {
  const jwt = Container.get(GenerateJoseJwt);
  const repository = Container.get(AuthDrizzleRepo);

  const header = req.header();

  if (!header["authorization"]) {
    throw new UnauthorizedException();
  }

  const token = header["authorization"].split(" ")[1];

  try {
    const payload = await jwt.verify(token);

    const session = await repository.getSession(payload.token_id);

    if (!session) throw new UnauthorizedException();

    await next();
  } catch (error) {
    const payload = jwt.decode(token);

    const removeSessionCase = Container.get(RemoveSessionCase);

    await removeSessionCase.execute(new RemoveSessionCommand(payload.token_id));

    throw new UnauthorizedException();
  }
}
