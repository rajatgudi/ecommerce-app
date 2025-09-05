import {doublePrecision, integer, pgTable, timestamp, varchar} from "drizzle-orm/pg-core";
import {createInsertSchema} from "drizzle-zod";

export const productsTable = pgTable("products", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 50}).notNull(),
    description: varchar({length: 255}),
    image: varchar({length: 255}),
    price: doublePrecision().notNull(),
    quantity: integer().default(0),
    createdAt: timestamp("created_at", {withTimezone: true}).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", {withTimezone: true}).defaultNow().notNull(),
});


export const createProductSchema = createInsertSchema(productsTable);

export const updateProductSchema = createInsertSchema(productsTable).partial()