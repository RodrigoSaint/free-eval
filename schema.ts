import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';

export const evalGroups = sqliteTable('eval_groups', {
    id: text().primaryKey(),
    name: text().notNull(),
    createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString())
});

export const evals = sqliteTable('evals', {
    id: text().primaryKey(),
    input: text({ mode: 'json' }).notNull(),
    output: text({ mode: 'json' }),
    expected: text({ mode: 'json' }),
    inputFingerPrint: text('input_finger_print').notNull(),
    evalGroupId: text('eval_group_id').notNull().references(() => evalGroups.id),
    createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString())
}, (table) => [
    index('input_finger_print_idx').on(table.inputFingerPrint),
]);