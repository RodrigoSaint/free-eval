import { sqliteTable, text, real, integer, index } from 'drizzle-orm/sqlite-core';

export const evalGroups = sqliteTable('eval_groups', {
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text().notNull(),
    model: text().notNull(),
    genericPrompt: text(),
    version: integer().notNull(),
    duration: real().notNull().default(0),
    createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()).notNull(),
    updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()).notNull()
});

export const evals = sqliteTable('evals', {
    id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
    input: text({ mode: 'json' }).notNull(),
    output: text({ mode: 'json' }).notNull(),
    expected: text({ mode: 'json' }),
    formattedInput: text('formatted_input'),
    formattedOutput: text('formatted_output'),
    score: real().notNull(),
    duration: real().notNull().default(0),
    inputFingerPrint: text('input_finger_print').notNull(),
    evalGroupId: text('eval_group_id').notNull().references(() => evalGroups.id),
    createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString())
}, (table) => [
    index('input_finger_print_idx').on(table.inputFingerPrint),
]);

export const evalGroupThreshold = sqliteTable('eval_group_threshold', {
    id: text().primaryKey().references(() => evalGroups.id),
    goodScore: real().notNull(),
    averageScore: real().notNull(),
    createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString())
})