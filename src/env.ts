import { consola } from "consola";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

expand(config({ quiet: true }));

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
});

export type env = z.infer<typeof EnvSchema>;

let env: env;

try {
  // oxlint-disable-next-line no-process-env
  env = EnvSchema.parse(process.env);
} catch (e) {
  const error = e as z.ZodError;
  consola.error("Invalid environment variables");
  consola.box(z.flattenError(error).fieldErrors);
  process.exit(1);
}

export default env;
