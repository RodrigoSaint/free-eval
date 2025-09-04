import { migrate } from "drizzle-orm/libsql/migrator"
import { db } from "./db.ts"

console.log("Starting migration")
await migrate(db, { migrationsFolder: "./drizzle/" });
console.log("Ending migration")

