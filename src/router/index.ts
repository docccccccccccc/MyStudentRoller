import { createRouter, createWebHashHistory } from 'vue-router'
import RollingPage from '@/views/RollingPage.vue'
import HistoryPage from '@/views/HistoryPage.vue'
import GlobalSettings from '@/views/GlobalSettings.vue'
import AboutPage from '@/views/AboutPage.vue'
import HowToUse from '@/views/HowToUse.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { component: RollingPage, path: '/' },
    { component: HistoryPage, path: '/history' },
    { component: GlobalSettings, path: '/settings' },
    { component: AboutPage, path: '/about' },
    { component: HowToUse, path: '/help' },
  ],
})

export default router
