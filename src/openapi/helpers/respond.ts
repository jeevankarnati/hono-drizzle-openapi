import type { RouteConfig, RouteConfigToTypedResponse } from "@hono/zod-openapi";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { z, ZodType } from "zod";

type ExtractJsonContent<C> = C extends { [K in keyof C]: infer A }
  ? A extends Record<"schema", ZodType>
    ? z.output<A["schema"]>
    : never
  : never;

export type JsonBodyFor<
  R extends RouteConfig,
  S extends keyof R["responses"],
> = R["responses"][S] extends { content: infer C } ? ExtractJsonContent<C> : never;

export type StatusAndBody<R extends RouteConfig> = {
  [S in keyof R["responses"] & number]: [status: S, data: JsonBodyFor<R, S>];
}[keyof R["responses"] & number];

/** Status codes whose OpenAPI response has no `content` (e.g. 204 No Content). */
export type NoContentStatusCodes<R extends RouteConfig> = {
  [S in keyof R["responses"] & number]: R["responses"][S] extends { content: object } ? never : S;
}[keyof R["responses"] & number];

export function respondJson<R extends RouteConfig>(
  c: Context,
  ...statusAndBody: StatusAndBody<R>
): RouteConfigToTypedResponse<R> {
  const [status, data] = statusAndBody;
  return c.json(data, status as ContentfulStatusCode) as unknown as RouteConfigToTypedResponse<R>;
}

export function respondNoContent<R extends RouteConfig>(
  c: Context,
  status: NoContentStatusCodes<R>
): RouteConfigToTypedResponse<R> {
  return c.body(null, status as ContentfulStatusCode) as unknown as RouteConfigToTypedResponse<R>;
}
