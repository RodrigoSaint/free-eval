const databaseUrl = Deno.env.get('DATABASE_URL') || `file:${Deno.env.get('DATABASE_PATH') || 'database.db'}`;
const authToken = Deno.env.get('DATABASE_AUTH_TOKEN');
const user = Deno.env.get('DATABASE_USER');
const password = Deno.env.get('DATABASE_PASSWORD');

export default {
  schema: './schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: databaseUrl,
    ...(authToken && { authToken }),
    ...(user && { user }),
    ...(password && { password }),
  },
  out: './drizzle',
};