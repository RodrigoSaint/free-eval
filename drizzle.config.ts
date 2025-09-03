export default {
  schema: './schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: 'file:database.db',
  },
} as const;