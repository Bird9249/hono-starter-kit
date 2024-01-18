import {
  boolean,
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

export const sessions = pgTable("sessions", {
  id: char("id", { length: 36 }).unique().primaryKey().notNull(),
  user_id: integer("user_id")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "no action" })
    .notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  is_default: boolean("is_default").default(false).notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  deleted_at: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
});

export const usersToRoles = pgTable("users_to_roles", {
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "no action" }),
  role_id: integer("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade", onUpdate: "no action" }),
});

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name", { length: 50 }).notNull(),
  display_name: varchar("display_name", { length: 50 }).notNull(),
  subject_name: varchar("subject_name", { length: 50 }).notNull(),
  subject_display_name: varchar("subject_display_name", {
    length: 50,
  }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
});

export const rolesToPermissions = pgTable("roles_to_permissions", {
  role_id: integer("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade", onUpdate: "no action" }),
  permission_id: integer("permission_id")
    .notNull()
    .references(() => permissions.id, {
      onDelete: "cascade",
      onUpdate: "no action",
    }),
});

export type UserSchema = typeof users.$inferSelect;

export type SessionType = typeof sessions.$inferSelect;
export type InsertSessionType = typeof sessions.$inferInsert;

export type RoleSchema = typeof roles.$inferSelect;

export type UserToRoleType = typeof usersToRoles.$inferSelect;
export type InsertUserToRoleType = typeof usersToRoles.$inferInsert;

export type PermissionSchema = typeof permissions.$inferSelect;

export type RoleToPermissionType = typeof rolesToPermissions.$inferSelect;
export type InsertRoleToPermissionType = typeof rolesToPermissions.$inferInsert;
