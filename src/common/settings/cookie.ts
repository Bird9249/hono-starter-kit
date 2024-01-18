import { CookieOptions } from "hono/utils/cookie";

export const cookieOpts: CookieOptions = {
  httpOnly: true,
  path: "/",
  secure: false,
};
