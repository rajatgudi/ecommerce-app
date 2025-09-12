"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var drizzle_kit_1 = require("drizzle-kit");
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: './drizzle',
    schema: ['./src/db/schema/product.schema.ts', './src/db/schema/[auth].schema.ts'],
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
    verbose: true,
    strict: true
});
