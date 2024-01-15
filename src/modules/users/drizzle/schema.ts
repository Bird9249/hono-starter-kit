import {
  char,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

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

export interface UserType
  extends Omit<typeof users.$inferSelect, "password" | "deleted_at"> {
  password?: string;
  deleted_at?: string;
}
export type InsertUserType = typeof users.$inferInsert;

export const sessions = pgTable("sessions", {
  id: char("id", { length: 36 }).unique().primaryKey().notNull(),
  user_id: integer("user_id")
    .references(() => users.id)
    .notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export type SessionType = typeof sessions.$inferSelect;
export type InsertSessionType = typeof sessions.$inferInsert;
