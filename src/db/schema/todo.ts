import { sql } from "drizzle-orm";
import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const todosTable = pgTable("todos", {
  id: uuid()
    .primaryKey()
    .default(sql`uuidv7()`),
  title: varchar({ length: 255 }).notNull(),
  completed: boolean().notNull().default(false),
  createdAt: timestamp({ mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp({ mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const insertTodoSchema = createInsertSchema(todosTable, {
  title: (schema) => schema.min(1),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .required({
    title: true,
    completed: true,
  });

export const selectTodoSchema = createSelectSchema(todosTable);

export const updateTodoSchema = insertTodoSchema.partial();
