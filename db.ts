import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { evalGroups, evals } from './schema.ts';

const databaseUrl = Deno.env.get('DATABASE_URL') || `file:${Deno.env.get('DATABASE_PATH') || 'database.db'}`;
const authToken = Deno.env.get('DATABASE_AUTH_TOKEN');
const user = Deno.env.get('DATABASE_USER');
const password = Deno.env.get('DATABASE_PASSWORD');

// For local file - creates the .db file if it doesn't exist
// For remote LibSQL - supports auth token, user, and password
const client = createClient({
    url: databaseUrl,
    ...(authToken && { authToken }),
    ...(user && { user }),
    ...(password && { password })
});

const db = drizzle(client);

export { db, evalGroups, evals };
