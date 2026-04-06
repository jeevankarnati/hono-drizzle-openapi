import { Scalar } from "@scalar/hono-api-reference";
import env from "@/env";
import type { AppOpenAPI } from "./types";
import packageJSON from "../../package.json";

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      title: "Hono API",
      version: packageJSON.version,
    },
    servers: [{ url: `http://localhost:${env.PORT}` }],
  });

  app.get(
    "/reference",
    Scalar({
      url: "/doc",
      theme: "deepSpace",
      defaultHttpClient: { targetKey: "js", clientKey: "fetch" },
      pageTitle: "Hono API",
      mcp: { disabled: true },
      agent: { disabled: true },
    })
  );
}
