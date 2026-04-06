import { eq } from "drizzle-orm";
import type { AppRouteHandler } from "@/libs/types";
import db from "@/db";
import { todosTable } from "@/db/schema/todo";
import * as HTTP_STATUS_CODES from "@/helpers/http-status-codes";
import * as HTTP_STATUS_PHRASES from "@/helpers/http-status-phrases";
import { respondJson, respondNoContent } from "@/openapi/helpers/respond";
import type {
  CreateRoute,
  DeleteOneRoute,
  GetAllRoute,
  GetOneRoute,
  UpdateRoute,
} from "./todos.routes";

export const getAll: AppRouteHandler<GetAllRoute> = async (c) => {
  const todos = await db.query.todos.findMany();
  return respondJson<GetAllRoute>(c, HTTP_STATUS_CODES.OK, todos);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const todo = c.req.valid("json");
  const [insertedTodo] = await db.insert(todosTable).values(todo).returning();
  return respondJson<CreateRoute>(c, HTTP_STATUS_CODES.CREATED, insertedTodo);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const params = c.req.valid("param");
  const todo = await db.query.todos.findFirst({
    where: eq(todosTable.id, params.id),
  });
  if (!todo) {
    return respondJson<GetOneRoute>(c, HTTP_STATUS_CODES.NOT_FOUND, {
      message: HTTP_STATUS_PHRASES.NOT_FOUND,
    });
  }
  return respondJson<GetOneRoute>(c, HTTP_STATUS_CODES.OK, todo);
};

export const update: AppRouteHandler<UpdateRoute> = async (c) => {
  const params = c.req.valid("param");
  const body = c.req.valid("json");
  const [updatedTodo] = await db
    .update(todosTable)
    .set(body)
    .where(eq(todosTable.id, params.id))
    .returning();
  if (!updatedTodo) {
    return respondJson<UpdateRoute>(c, HTTP_STATUS_CODES.NOT_FOUND, {
      message: HTTP_STATUS_PHRASES.NOT_FOUND,
    });
  }
  return respondJson<UpdateRoute>(c, HTTP_STATUS_CODES.OK, updatedTodo);
};

export const deleteOne: AppRouteHandler<DeleteOneRoute> = async (c) => {
  const params = c.req.valid("param");
  const result = await db.delete(todosTable).where(eq(todosTable.id, params.id));
  if (result.rowCount === 0) {
    return respondJson<DeleteOneRoute>(c, HTTP_STATUS_CODES.NOT_FOUND, {
      message: HTTP_STATUS_PHRASES.NOT_FOUND,
    });
  }
  return respondNoContent<DeleteOneRoute>(c, HTTP_STATUS_CODES.NO_CONTENT);
};
