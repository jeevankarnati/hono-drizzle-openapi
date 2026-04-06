import { pinoLogger as logger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";
import env from "../env";

export function pinoLogger() {
  return logger({
    pino: pino(env.NODE_ENV === "production" ? undefined : pretty()),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
