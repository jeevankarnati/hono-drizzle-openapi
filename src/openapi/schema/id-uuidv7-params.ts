import { z } from "@hono/zod-openapi";

const IdUUIDv7ParamsSchema = z.object({
  id: z.uuidv7().openapi({
    param: {
      name: "id",
      in: "path",
      required: true,
    },
    required: ["id"],
    example: "019d6408-6e86-76d7-9e7d-002517866a26",
  }),
});

export default IdUUIDv7ParamsSchema;
