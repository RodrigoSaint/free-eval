import { migrate } from "drizzle-orm/libsql/migrator"
import { db } from "./db.ts"

export const createDbInstance = async ( ) => {
    console.log("Starting migration")
    await migrate(db, { migrationsFolder: "./drizzle/" });
    console.log("Ending migration")
}

