import { migrate } from "drizzle-orm/libsql/migrator"
import { db } from "./db.ts"

export const createDbInstance = async ( ): Promise<void> => {
    console.log("Starting migration")
    console.log(import.meta)
    await migrate(db, { migrationsFolder: `./drizzle/` });
    console.log("Ending migration")
}
