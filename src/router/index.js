// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import { enterCurtain, leaveCurtain } from '@/composables/usePageTransition'
import { useProjectsStore } from '@/stores/useProjectsStore'

/**
 * Hidden back-office URL. Override at build time with VITE_ADMIN_PATH
 * (GitHub repository variable ADMIN_PATH). Access is protected by login.
 */
export const ADMIN_PATH = '/' + String(import.meta.env.VITE_ADMIN_PATH || 'studio-43cc16').replace(/^\/+|\/+$/g, '')

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
    meta: { title: 'Projets' },
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
    meta: { title: 'À propos' },
  },
  {
    path: '/mentions-legales',
    name: 'legal',
    component: () => import('@/views/Legal.vue'),
    meta: { title: 'Mentions légales' },
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

function curtainLabelFor(to) {
  if (to.name === 'project') {
    return useProjectsStore().bySlug(String(to.params.slug))?.title || 'Projet'
  }
  if (to.name === 'home') return 'KOSMO'
  return to.meta?.title || 'KOSMO'
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

  if (to.name !== 'project') {
    document.title = to.meta?.title ? `${to.meta.title} — Kosmo.` : 'BasileFeRi - Kosmo.'
  }

  // Small tick so the new route's DOM is rendered before the curtain leaves.
  setTimeout(leaveCurtain, 80)
})

export default router
