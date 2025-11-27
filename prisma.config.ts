import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        // @ts-ignore - provider is required at runtime but not in types
        provider: 'postgresql',
        url: env('DATABASE_URL'),
        shadowDatabaseUrl: env('SHADOW_DATABASE_URL')
    },
});
