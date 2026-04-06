import { z } from "zod";

const createErrorSchema = <T extends z.ZodType>(schema: T) => {
  const parseInput =
    schema.def.type === "array"
      ? [
          (schema.def as { type: "array"; element: z.ZodType }).element.def.type === "string"
            ? 123
            : "invalid",
        ]
      : {};

  const { error } = schema.safeParse(parseInput);

  const example = error
    ? {
        name: error.name,
        issues: error.issues.map((issue) => ({
          expected: issue.code === "invalid_type" ? issue.expected : undefined,
          code: issue.code,
          path: issue.path,
          message: issue.message,
        })),
      }
    : {
        name: "ZodError",
        issues: [
          {
            expected: "string",
            code: "invalid_type",
            path: ["fieldName"],
            message: "Expected string, received undefined",
          },
        ],
      };

  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    error: z
      .object({
        issues: z.array(
          z.object({
            origin: z.string().optional(),
            minimum: z.number().optional(),
            maximum: z.number().optional(),
            expected: z.string().optional(),
            inclusive: z.boolean().optional(),
            code: z.string(),
            path: z.array(z.union([z.string(), z.number()])),
            message: z.string().optional(),
          })
        ),
        name: z.string(),
      })
      .openapi({
        example,
      }),
  });
};

export default createErrorSchema;
