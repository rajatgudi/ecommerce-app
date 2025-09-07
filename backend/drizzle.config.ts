import {defineConfig} from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: ['./src/db/schema/product.schema.ts', './src/db/schema/auth.schema.ts'],
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true
});
