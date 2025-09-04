import process from "node:process"

const databaseUrl = process.env['DATABASE_URL'] || `file:${process.env['DATABASE_PATH'] || 'database.db'}`;
const authToken = process.env['DATABASE_AUTH_TOKEN'];
const user = process.env['DATABASE_USER'];
const password = process.env['DATABASE_PASSWORD'];

export default {
  schema: './infrastructure/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: databaseUrl,
    ...(authToken && { authToken }),
    ...(user && { user }),
    ...(password && { password }),
  },
  out: './drizzle',
};