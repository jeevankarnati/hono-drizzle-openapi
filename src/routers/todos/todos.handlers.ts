import type { AppRouteHandler } from "@/libs/types";
import * as HTTP_STATUS_CODES from "@/helpers/http-status-codes";
import * as HTTP_STATUS_PHRASES from "@/helpers/http-status-phrases";
import { respondJson, respondNoContent } from "@/openapi/helpers/respond";
import type {
  CountRoute,
  CreateRoute,
  DeleteOneRoute,
  GetAllRoute,
  GetOneRoute,
  UpdateRoute,
} from "./todos.routes";
import * as todosService from "./todos.service";

export const getAll: AppRouteHandler<GetAllRoute> = async (c) => {
  const user = c.get("user");
  const todos = await todosService.getAllTodosByUserId(user!.id);
  return respondJson<GetAllRoute>(c, HTTP_STATUS_CODES.OK, todos);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const user = c.get("user");
  const todo = c.req.valid("json");
  const insertedTodo = await todosService.createTodo(todo, user!.id);
  return respondJson<CreateRoute>(c, HTTP_STATUS_CODES.CREATED, insertedTodo);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const params = c.req.valid("param");
  const user = c.get("user");
  const todo = await todosService.getTodoByIdAndUserId(params.id, user!.id);
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
  const user = c.get("user");
  const updatedTodo = await todosService.updateTodo(params.id, body, user!.id);
  if (!updatedTodo) {
    return respondJson<UpdateRoute>(c, HTTP_STATUS_CODES.NOT_FOUND, {
      message: HTTP_STATUS_PHRASES.NOT_FOUND,
    });
  }
  return respondJson<UpdateRoute>(c, HTTP_STATUS_CODES.OK, updatedTodo);
};

export const deleteOne: AppRouteHandler<DeleteOneRoute> = async (c) => {
  const params = c.req.valid("param");
  const user = c.get("user");
  const result = await todosService.deleteTodo(params.id, user!.id);
  if (result.rowCount === 0) {
    return respondJson<DeleteOneRoute>(c, HTTP_STATUS_CODES.NOT_FOUND, {
      message: HTTP_STATUS_PHRASES.NOT_FOUND,
    });
  }
  return respondNoContent<DeleteOneRoute>(c, HTTP_STATUS_CODES.NO_CONTENT);
};

export const count: AppRouteHandler<CountRoute> = async (c) => {
  const user = c.get("user");
  const count = await todosService.countTodosByUserId(user!.id);
  return respondJson<CountRoute>(c, HTTP_STATUS_CODES.OK, count);
};
