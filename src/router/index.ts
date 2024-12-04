import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "gameRankings",
      component: () => import("../views/gameRankings.vue"),
    },
    {
      path: "/rankDetail",
      name: "rankDetail",
      component: () => import("../views/rankDetail.vue"),
    },
    {
      path: "/compete",
      name: "compete",
      component: () => import("../views/compete.vue"),
    },
  ],
});

export default router;
