import { z } from "@hono/zod-openapi";
import oneOf from "./one-of.js";

const jsonContentOneOf = <T extends z.ZodType>({
  schemas,
  description,
  required = false,
}: {
  schemas: T[];
  description: string;
  required?: boolean;
}) => {
  return {
    content: {
      "application/json": {
        schema: {
          oneOf: oneOf(schemas),
        },
      },
    },
    description,
    required,
  };
};

export default jsonContentOneOf;
