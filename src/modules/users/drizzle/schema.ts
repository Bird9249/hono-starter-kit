import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey().notNull(),
  username: varchar("username", { length: 20 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  password: text("password").notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  deleted_at: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
});

interface User
  extends Omit<typeof users.$inferSelect, "password" | "deleted_at"> {
  password?: string;
  deleted_at?: string;
}

export type UserType = User;

export type InsertUserType = typeof users.$inferInsert;
