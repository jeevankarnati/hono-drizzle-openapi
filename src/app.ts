import configureOpenAPI from "./libs/configure-open-api";
import createApp from "./libs/create-app";
import todosRoute from "./routers/todos/todos.index";

const app = createApp();

const routes = [todosRoute];

configureOpenAPI(app);

routes.forEach((route) => {
  app.route("/", route);
});

export default app;
