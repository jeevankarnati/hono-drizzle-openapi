import { OpenAPIHono } from "@hono/zod-openapi";
import notFound from "@/middleware/not-found";
import onError from "@/middleware/on-error";
import { pinoLogger } from "@/middleware/pino-logger";
import defaultHook from "@/openapi/default-hook";
import type { AppBindings } from "./types";

export function createRouter() {
  return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}

export default function createApp() {
  const app = createRouter();
  app.use(pinoLogger());

  app.notFound(notFound);
  app.onError(onError);
  return app;
}
