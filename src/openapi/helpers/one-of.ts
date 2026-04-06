import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "@hono/zod-openapi";

const oneOf = <T extends z.ZodType>(schemas: T[]) => {
  const registry = new OpenAPIRegistry();

  schemas.forEach((schema, index) => {
    registry.register(index.toString(), schema);
  });

  const generator = new OpenApiGeneratorV3(registry.definitions);
  const components = generator.generateComponents();

  return components.components?.schemas ? Object.values(components.components!.schemas!) : [];
};

export default oneOf;
