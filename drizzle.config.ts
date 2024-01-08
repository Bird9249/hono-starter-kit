import type { Config } from "drizzle-kit";

export default {
  schema: ["./src/modules/users/drizzle/schema.ts"],
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: process.env["DB_HOST"] as string,
    port: Number(process.env["DB_PORT"]),
    user: process.env["DB_USER"],
    password: process.env["DB_PASSWORD"],
    database: process.env["DB_NAME"] as string,
  },
} satisfies Config;
