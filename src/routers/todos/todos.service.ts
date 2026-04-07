import { eq } from "drizzle-orm";
import db from "@/db";
import type { InsertTodo, UpdateTodo } from "./todos.schema";
import { todosTable } from "./todos.model";

export const getAllTodos = async () => {
  return await db.query.todos.findMany();
};

export const getTodoById = async (id: string) => {
  return await db.query.todos.findFirst({
    where: eq(todosTable.id, id),
  });
};

export const createTodo = async (todo: InsertTodo) => {
  const [newTodo] = await db.insert(todosTable).values(todo).returning();
  return newTodo;
};

export const updateTodo = async (id: string, todo: UpdateTodo) => {
  const [updatedTodo] = await db
    .update(todosTable)
    .set(todo)
    .where(eq(todosTable.id, id))
    .returning();
  return updatedTodo;
};

export const deleteTodo = async (id: string) => {
  return await db.delete(todosTable).where(eq(todosTable.id, id));
};
