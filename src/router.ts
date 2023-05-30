import {
  createRouter as createVueRouter,
  createWebHistory,
  createMemoryHistory,
} from "vue-router";
import Home from "./pages/Home.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/recipies",
    component: () => import("./pages/RecipieList.vue"),
  },
];

export function createRouter() {
  const router = createVueRouter({
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  });

  return router;
}
