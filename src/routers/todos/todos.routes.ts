import { z } from "@hono/zod-openapi";
import * as HTTP_STATUS_CODES from "@/helpers/http-status-codes";
import { createProtectedRoute } from "@/openapi/create-protected-route";
import jsonContent from "@/openapi/helpers/json-content";
import jsonContentOneOf from "@/openapi/helpers/json-content-one-of";
import createErrorSchema from "@/openapi/schema/create-error-schema";
import IdUUIDv7ParamsSchema from "@/openapi/schema/id-uuidv7-params";
import notFoundSchema from "@/openapi/schema/not-found-schema";
import { insertTodoSchema, selectTodoSchema, updateTodoSchema } from "./todos.schema";

const tags = ["Todos"];

export const getAll = createProtectedRoute({
  tags,
  method: "get",
  path: "/todos",
  responses: {
    [HTTP_STATUS_CODES.OK]: jsonContent({
      schema: z.array(selectTodoSchema),
      description: "This is the list of todos for current user",
    }),
  },
});

export const create = createProtectedRoute({
  tags,
  method: "post",
  path: "/todos",
  request: {
    body: jsonContent({
      schema: insertTodoSchema,
      description: "Todo to create for current user",
      required: true,
    }),
  },
  responses: {
    [HTTP_STATUS_CODES.CREATED]: jsonContent({
      schema: selectTodoSchema,
      description: "Created Todo for current user",
    }),
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: jsonContent({
      schema: createErrorSchema(insertTodoSchema),
      description: "Unprocessable Entity",
    }),
  },
});

export const getOne = createProtectedRoute({
  tags,
  method: "get",
  path: "/todos/{id}",
  request: {
    params: IdUUIDv7ParamsSchema,
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: jsonContent({
      schema: selectTodoSchema,
      description: "Requested Todo for current user",
    }),
    [HTTP_STATUS_CODES.NOT_FOUND]: jsonContent({
      schema: notFoundSchema,
      description: "Requested Todo not found",
    }),
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: jsonContent({
      schema: createErrorSchema(IdUUIDv7ParamsSchema),
      description: "Invalid id error",
    }),
  },
});

export const update = createProtectedRoute({
  tags,
  method: "patch",
  path: "/todos/{id}",
  request: {
    params: IdUUIDv7ParamsSchema,
    body: jsonContent({
      schema: updateTodoSchema,
      description: "Todo to update",
      required: true,
    }),
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: jsonContent({
      schema: selectTodoSchema,
      description: "Updated Todo for current user",
    }),
    [HTTP_STATUS_CODES.NOT_FOUND]: jsonContent({
      schema: notFoundSchema,
      description: "Requested Todo not found",
    }),
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: jsonContentOneOf({
      schemas: [createErrorSchema(IdUUIDv7ParamsSchema), createErrorSchema(updateTodoSchema)],
      description: "Invalid id error",
    }),
  },
});

export const deleteOne = createProtectedRoute({
  tags,
  method: "delete",
  path: "/todos/{id}",
  request: {
    params: IdUUIDv7ParamsSchema,
  },
  responses: {
    [HTTP_STATUS_CODES.NO_CONTENT]: {
      description: "Deleted Todo for current user",
    },
    [HTTP_STATUS_CODES.NOT_FOUND]: jsonContent({
      schema: notFoundSchema,
      description: "Requested Todo not found",
    }),
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: jsonContent({
      schema: createErrorSchema(IdUUIDv7ParamsSchema),
      description: "Invalid id error",
    }),
  },
});

export const count = createProtectedRoute({
  tags,
  method: "get",
  path: "/todos/count",
  responses: {
    [HTTP_STATUS_CODES.OK]: jsonContent({
      schema: z.number(),
      description: "Count of todos for current user",
    }),
  },
});

export type GetAllRoute = typeof getAll;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type DeleteOneRoute = typeof deleteOne;
export type CountRoute = typeof count;
