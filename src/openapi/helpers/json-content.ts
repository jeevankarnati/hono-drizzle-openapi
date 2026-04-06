import type { z } from "@hono/zod-openapi";

const jsonContent = <T extends z.ZodType>({
  schema,
  description,
  required = false,
}: {
  schema: T;
  description: string;
  required?: boolean;
}) => {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
    required,
  };
};

export default jsonContent;
