import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue";
import RecipieList from "../pages/RecipieList.vue";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/recipies",
    component: RecipieList,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
