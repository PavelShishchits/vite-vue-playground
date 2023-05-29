import { createApp as createVueApp, createSSRApp } from "vue";
import "./css/global.scss";
import { createRouter } from "./router";
import App from "./App.vue";

export function createApp() {
  const app = createSSRApp(App);

  const router = createRouter();
  app.use(router);

  return {
    app,
    router,
  };
}
