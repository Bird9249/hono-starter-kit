import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { Service } from "typedi";
import { users } from "../../modules/users/drizzle/schema";

@Service()
export default class DrizzleConnection {
  public readonly connection = drizzle(
    postgres({
      max: 1,
      host: process.env["DB_HOST"],
      user: process.env["DB_USER"],
      password: process.env["DB_PASSWORD"],
      database: process.env["DB_NAME"],
      port: Number(process.env["DB_PORT"]),
    }),
    { schema: { ...users } }
  );
}
