import { createRouter, createWebHashHistory } from 'vue-router'
import RandomStudent from '@/views/RandomStudent.vue'
import RandomHistory from '@/views/RandomHistory.vue'
import RandomSettings from '@/views/RandomSettings.vue'
import AboutPage from '@/views/AboutPage.vue'
import HowToUse from '@/views/HowToUse.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { component: RandomStudent, path: '/' },
    { component: RandomHistory, path: '/history' },
    { component: RandomSettings, path: '/settings' },
    { component: AboutPage, path: '/about' },
    { component: HowToUse, path: '/help' },
  ],
})

export default router
