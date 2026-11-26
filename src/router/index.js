// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import { enterCurtain, leaveCurtain } from '@/composables/usePageTransition'
import { useProjectsStore } from '@/stores/useProjectsStore'
import { t } from '@/i18n'

/**
 * Hidden back-office URL. Override at build time with VITE_ADMIN_PATH
 * (GitHub repository variable ADMIN_PATH). Access is protected by login.
 */
export const ADMIN_PATH = '/' + String(import.meta.env.VITE_ADMIN_PATH || 'studio').replace(/^\/+|\/+$/g, '')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/ProjectsIndex.vue'),
    meta: { titleKey: 'routes.projects' },
  },
  {
    path: '/projects/:slug',
    name: 'project',
    component: () => import('@/views/ProjectPage.vue'),
    props: true,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutPage.vue'),
    meta: { titleKey: 'routes.about' },
  },
  {
    path: '/mentions-legales',
    name: 'legal',
    component: () => import('@/views/Legal.vue'),
    meta: { titleKey: 'routes.legal' },
  },
  {
    path: ADMIN_PATH,
    name: 'admin',
    component: () => import('@/admin/AdminApp.vue'),
    meta: { title: 'Studio', admin: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const routeTitle = (to) => (to.meta?.titleKey ? t(to.meta.titleKey) : to.meta?.title || '')

function curtainLabelFor(to) {
  if (to.name === 'project') {
    return useProjectsStore().bySlug(String(to.params.slug))?.title || t('routes.project')
  }
  if (to.name === 'home') return 'KOSMO'
  return routeTitle(to) || 'KOSMO'
}

/** Tab title of every page except project pages (they set their own). Re-run when the language changes. */
export function applyPageTitle(to) {
  if (to.name === 'project') return
  const title = routeTitle(to)
  document.title = title ? `${title} | Kosmo.` : t('meta.title')
}

// Curtain transition: cover on leave, reveal on arrive.
router.beforeEach((to, from) => {
  if (!from.name) return true // initial load: the splash preloader handles it
  if (to.path === from.path) return true // query-only change (admin editor)
  return new Promise((resolve) => enterCurtain(() => resolve(true), curtainLabelFor(to)))
})

router.afterEach((to) => {
  // Keep the back office out of search engines.
  let robots = document.querySelector('meta[name="robots"]')
  if (to.meta?.admin) {
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = 'noindex, nofollow'
  } else if (robots) {
    robots.remove()
  }

  applyPageTitle(to)

  // Small tick so the new route's DOM is rendered before the curtain leaves.
  setTimeout(leaveCurtain, 80)
})

export default router
