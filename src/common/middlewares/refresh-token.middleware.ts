import { Context, Env, Next } from "hono";
import { getCookie } from "hono/cookie";
import Container from "typedi";
import GenerateJoseJwt from "../../infrastructure/jwt/generate-jose-jwt";
import { UnauthorizedException } from "../exception/http";

export default async function (c: Context<Env, string, {}>, next: Next) {
  const jwt = Container.get(GenerateJoseJwt);

  const token = getCookie(c, "refresh_token");

  if (!token) throw new UnauthorizedException();

  try {
    await jwt.verify(token);

    await next();
  } catch (error) {
    throw new UnauthorizedException();
  }
}
