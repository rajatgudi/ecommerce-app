import {doublePrecision, integer, pgTable, varchar} from "drizzle-orm/pg-core";

export const productsTable = pgTable("products", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 50}).notNull(),
    description: varchar({length: 255}),
    image: varchar({length: 255}),
    price: doublePrecision().notNull()
});
