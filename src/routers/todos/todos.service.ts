import { and, count, eq } from "drizzle-orm";
import db from "@/db";
import type { InsertTodo, UpdateTodo } from "./todos.schema";
import { todosTable } from "./todos.model";

export const getAllTodosByUserId = async (userId: string) => {
  return await db.query.todos.findMany({
    where: eq(todosTable.userId, userId),
  });
};

export const getTodoByIdAndUserId = async (id: string, userId: string) => {
  return await db.query.todos.findFirst({
    where: and(eq(todosTable.id, id), eq(todosTable.userId, userId)),
  });
};

export const createTodo = async (todo: InsertTodo, userId: string) => {
  const [newTodo] = await db
    .insert(todosTable)
    .values({ ...todo, userId })
    .returning();
  return newTodo;
};

export const updateTodo = async (id: string, todo: UpdateTodo, userId: string) => {
  const [updatedTodo] = await db
    .update(todosTable)
    .set(todo)
    .where(and(eq(todosTable.id, id), eq(todosTable.userId, userId)))
    .returning();
  return updatedTodo;
};

export const deleteTodo = async (id: string, userId: string) => {
  return await db
    .delete(todosTable)
    .where(and(eq(todosTable.id, id), eq(todosTable.userId, userId)));
};

export const countTodosByUserId = async (userId: string) => {
  const [result] = await db
    .select({ count: count() })
    .from(todosTable)
    .where(eq(todosTable.userId, userId));
  return result?.count ?? 0;
};
