import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("../view/login.vue"),
  },
  {
    path: "/home",
    component: () => import("../view/home.vue"),
    children: [
      {
        path: "create",
        component: () => import("@/view/create.vue"),
      },
      {
        path: "show",
        component: () => import("@/view/show.vue"),
      },
    ],
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
