import { createRouter } from "@/libs/create-app";
import * as handlers from "./todos.handlers";
import * as routes from "./todos.routes";

const router = createRouter()
  .openapi(routes.getAll, handlers.getAll)
  .openapi(routes.create, handlers.create)
  .openapi(routes.count, handlers.count)
  .openapi(routes.getOne, handlers.getOne)
  .openapi(routes.update, handlers.update)
  .openapi(routes.deleteOne, handlers.deleteOne);

export default router;
