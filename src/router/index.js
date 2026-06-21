// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import ProjectPage from '@/views/ProjectPage.vue';
import { enterCurtain, leaveCurtain } from '@/composables/usePageTransition';

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomePage
    },
    {
        path: '/projects/:slug',
        name: 'project',
        component: ProjectPage,
        props: true
    },
    {
        path: '/about',
        name: 'About',
        component: () => import('../views/AboutPage.vue')
    },
    {
        path: '/mentions-legales', component: () => import('@/views/Legal.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Curtain transition: cover on leave, reveal on arrive
router.beforeEach((to, from, next) => {
  if (!from.name) { next(); return } // skip initial load
  enterCurtain(() => next())
})

router.afterEach(() => {
  // small tick so the new route's DOM is rendered before curtain leaves
  setTimeout(leaveCurtain, 60)
})

export default router;
