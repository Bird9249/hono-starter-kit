import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const sql = postgres({
  max: 1,
  host: process.env["DB_HOST"],
  user: process.env["DB_USER"],
  password: process.env["DB_PASSWORD"],
  database: process.env["DB_NAME"],
  port: Number(process.env["DB_PORT"]),
});
const db = drizzle(sql);

await migrate(db, { migrationsFolder: "drizzle" });

await sql.end();
