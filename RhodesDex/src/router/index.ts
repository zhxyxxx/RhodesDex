import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  // Hash 路由可直接部署到 GitHub Pages，无需服务器配置 SPA 回退。
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/event',
    },
    {
      path: '/elite',
      name: 'elite-ranking',
      component: () => import('../components/EliteRankingTable.vue'),
    },
    {
      path: '/event',
      name: 'event-ranking',
      component: () => import('../components/EventRankingTable.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
