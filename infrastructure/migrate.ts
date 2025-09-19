import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./db.ts";

export const createDbInstance = async (): Promise<void> => {
  const migrationsFolder = import.meta.resolve('../drizzle')

  await migrate(db, { migrationsFolder });
  console.log("Migration finished");
};
