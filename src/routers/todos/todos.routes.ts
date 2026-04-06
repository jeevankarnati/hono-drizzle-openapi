import { createRoute, z } from "@hono/zod-openapi";
import { insertTodoSchema, selectTodoSchema, updateTodoSchema } from "@/db/schema/todo";
import * as HTTP_STATUS_CODES from "@/helpers/http-status-codes";
import jsonContent from "@/openapi/helpers/json-content";
import jsonContentOneOf from "@/openapi/helpers/json-content-one-of";
import createErrorSchema from "@/openapi/schema/create-error-schema";
import IdUUIDv7ParamsSchema from "@/openapi/schema/id-uuidv7-params";
import notFoundSchema from "@/openapi/schema/not-found-schema";

const tags = ["Todos"];

export const getAll = createRoute({
  tags,
  method: "get",
  path: "/todos",
  responses: {
    [HTTP_STATUS_CODES.OK]: jsonContent({
      schema: z.array(selectTodoSchema),
      description: "This is the list of todos",
    }),
  },
});

export const create = createRoute({
  tags,
  method: "post",
  path: "/todos",
  request: {
    body: jsonContent({
      schema: insertTodoSchema,
      description: "Todo to create",
      required: true,
    }),
  },
  responses: {
    [HTTP_STATUS_CODES.CREATED]: jsonContent({
      schema: selectTodoSchema,
      description: "Created Todo",
    }),
    [HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY]: jsonContent({
      schema: createErrorSchema(insertTodoSchema),
      description: "Unprocessable Entity",
    }),
  },
});

export const getOne = createRoute({
  tags,
  method: "get",
  path: "/todos/{id}",
  request: {
    params: IdUUIDv7ParamsSchema,
  },
  responses: {
    [HTTP_STATUS_CODES.OK]: jsonContent({
      schema: selectTodoSchema,
      description: "Requested Todo",
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

export const update = createRoute({
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
      description: "Updated Todo",
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

export const deleteOne = createRoute({
  tags,
  method: "delete",
  path: "/todos/{id}",
  request: {
    params: IdUUIDv7ParamsSchema,
  },
  responses: {
    [HTTP_STATUS_CODES.NO_CONTENT]: {
      description: "Deleted Todo",
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

export type GetAllRoute = typeof getAll;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type UpdateRoute = typeof update;
export type DeleteOneRoute = typeof deleteOne;
