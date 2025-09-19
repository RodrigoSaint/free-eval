import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./db.ts";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let migrationsFolder: string;

if (__dirname.includes("node_modules")) {
  // file is inside a library
  const parts = __dirname.split(path.sep);
  const nodeModulesIndex = parts.lastIndexOf("node_modules");
  const libRoot = path.join(...parts.slice(0, nodeModulesIndex + 2)); // +2 to include the library name
  migrationsFolder = path.join(libRoot, "drizzle");
} else {
  // local migrations
  migrationsFolder = path.join(__dirname, '..', "drizzle");
}

console.log(migrationsFolder)

export const createDbInstance = async (): Promise<void> => {
  console.log("Running migrations from:", migrationsFolder);
  await migrate(db, { migrationsFolder });
  console.log("Migration finished");
};
