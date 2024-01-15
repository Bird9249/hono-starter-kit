import { Context, Env, Next } from "hono";
import Container from "typedi";
import GenerateJoseJwt from "../../infrastructure/jwt/generate-jose-jwt";
import { UnauthorizedException } from "../exception/http";

export default async function ({ req }: Context<Env, string, {}>, next: Next) {
  const jwt = Container.get(GenerateJoseJwt);

  const header = req.header();

  if (!header["authorization"]) {
    throw new UnauthorizedException();
  }

  const token = header["authorization"].split(" ")[1];

  try {
    await jwt.verify(token);

    await next();
  } catch (error) {
    throw new UnauthorizedException();
  }
}
