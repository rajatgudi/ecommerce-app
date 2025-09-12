import {boolean, pgTable, serial, text, timestamp, uuid, varchar} from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";
import {z} from "zod";

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", {length: 255}).notNull().unique(),
    password: varchar("password"),
    name: varchar("name", {length: 255}),
    role: varchar("role", {length: 50}).default("user"),
    googleId: varchar("googleId", {length: 255}),
    is_email_verified: boolean("is_email_verified").default(false).notNull(),

    createdAt: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", {withTimezone: true}).defaultNow().notNull(),
})

// Base schema generated from Drizzle table (gives the right types for fields)
const userInsertSchema = createInsertSchema(usersTable);

// Register payload: require email (as an email), password (string, min 8), optional name
export const registerSchema = userInsertSchema.extend({
    email: z.email("invalid email address"),
    password: z.string().min(8, "must be at least 8 characters long")
        .max(128, "must be at most 128 characters long")
        .refine((v) => /[A-Z]/.test(v), {
            message: " must contain at least one uppercase letter",
        })
        .refine((v) => /[a-z]/.test(v), {
            message: "must contain at least one lowercase letter",
        })
        .refine((v) => /\d/.test(v), {
            message: "must contain at least one number",
        })
        .refine(
            (v) => /[!@#$%^&*()_\-+[\]{};':"\\|,.<>/?`~]/.test(v),
            {message: "must contain at least one special character"}
        ),
    name: z.string().optional(),
})
// Login payload: email + password
export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

// Verify email (token)
export const verifyEmailSchema = z.object({
    token: z.string().min(1),
});

// Forgot password: only email (validate format)
export const forgotPasswordSchema = z.object({
    email: z.email(),
});

// Reset password: token + newPassword
export const resetPasswordSchema = z.object({
    token: z.string().min(1),
    newPassword: z.string().min(8),
});

//Refresh Token
export const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1),
})
export const logoutSchema = z.object({
    refreshToken: z.string().min(1),
})

export const refreshTokens = pgTable("refresh_tokens", {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").notNull().references(() => usersTable.id),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at", {withTimezone: true}).notNull(),
    revoked: boolean("revoked").default(false).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
})

export const emailVerifications = pgTable("email_verifications", {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").notNull().references(() => usersTable.id),
    token: text("token").notNull().unique(),
    expires_at: timestamp("expires_at").notNull(),
    used: boolean("used").default(false).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
});

export const passwordResets = pgTable("password_resets", {
    id: serial("id").primaryKey(),
    userId: uuid("user_id").notNull().references(() => usersTable.id),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    used: boolean("used").default(false).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
});