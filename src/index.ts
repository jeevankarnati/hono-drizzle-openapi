import { serve } from "@hono/node-server";
import { consola } from "consola";
import app from "./app";
import env from "./env";

const port = Number(env.PORT || 3000);

serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    consola.success(`Server is running on http://localhost:${port}`);
  }
);
