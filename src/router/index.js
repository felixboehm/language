import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LessonsOverview from '../views/LessonsOverview.vue'
import LessonDetail from '../views/LessonDetail.vue'
import Settings from '../views/Settings.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: '🌍 Language Learning' }
  },
  {
    path: '/lessons/:learning/:teaching',
    name: 'lessons-overview',
    component: LessonsOverview,
    meta: { title: null } // Will be set dynamically
  },
  {
    path: '/lesson/:learning/:teaching/:number',
    name: 'lesson-detail',
    component: LessonDetail,
    meta: { title: null } // Will be set dynamically
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { title: '⚙️ Settings' }
  }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
