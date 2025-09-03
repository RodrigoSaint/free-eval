import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { evalGroups, evals } from './schema.ts';

// For local file - creates the .db file if it doesn't exist
const client = createClient({
    url: 'file:database.db'
});

const db = drizzle(client);

export { db, evalGroups, evals };
