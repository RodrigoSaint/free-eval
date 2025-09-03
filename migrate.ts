import { db } from './db.ts';

const migrations = [
  `CREATE TABLE IF NOT EXISTS eval_groups (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    model TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`,
  
  `CREATE TABLE IF NOT EXISTS evals (
    id TEXT PRIMARY KEY,
    input TEXT NOT NULL,
    output TEXT NOT NULL,
    expected TEXT,
    score REAL NOT NULL,
    input_finger_print TEXT NOT NULL,
    eval_group_id TEXT NOT NULL REFERENCES eval_groups(id),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`,
  
  `CREATE INDEX IF NOT EXISTS input_finger_print_idx ON evals(input_finger_print);`
];

console.log('Running migrations...');
for (const [i, migration] of migrations.entries()) {
  try {
    await db.run(migration);
    console.log(`✓ Migration ${i + 1} completed`);
  } catch (error) {
    console.log(`• Migration ${i + 1} skipped (likely already exists)`);
  }
}
console.log('All migrations completed!');