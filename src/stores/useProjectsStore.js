import { defineStore } from 'pinia'
import staticProjects from '@/data/projects.js'
import { normalizeProject } from '@/data/normalizeProject.js'

const API_TIMEOUT_MS = 5000

async function fetchJson(url, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)
  try {
    const res = await fetch(url, { credentials: 'same-origin', ...options, signal: controller.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    if (!(res.headers.get('content-type') || '').includes('application/json')) throw new Error('Not JSON')
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

let pending = null

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [],
    loaded: false,
    source: null, // 'api' | 'static'
    preview: null, // draft opened by the admin with ?preview=1
    bust: 0, // cache-buster after a back-office save
  }),

  getters: {
    categories: (state) => [...new Set(state.projects.map((p) => p.category).filter(Boolean))],
  },

  actions: {
    /** Loads once; falls back to the static list if the API is unavailable. */
    load() {
      if (this.loaded) return Promise.resolve(this.projects)
      if (pending) return pending
      pending = fetchJson(this.bust ? `/api/projects.php?v=${this.bust}` : '/api/projects.php')
        .then((data) => {
          const list = Array.isArray(data?.projects) ? data.projects : []
          if (!list.length) throw new Error('Empty project list')
          this.projects = list.map(normalizeProject).filter((p) => p.slug)
          this.source = 'api'
        })
        .catch((err) => {
          if (import.meta.env.DEV) console.info('[projects] API unavailable, using static data:', err.message)
          this.projects = staticProjects.map(normalizeProject)
          this.source = 'static'
        })
        .then(() => {
          this.loaded = true
          pending = null
          return this.projects
        })
      return pending
    },

    bySlug(slug) {
      if (this.preview?.slug === slug) return this.preview
      return this.projects.find((p) => p.slug === slug) || null
    },

    /** Admin only: fetch a draft through the authenticated API to preview it. */
    async loadPreview(slug) {
      try {
        const data = await fetchJson('/api/admin.php?action=projects')
        const raw = (data?.projects || []).find((p) => p.slug === slug)
        this.preview = raw ? normalizeProject(raw) : null
      } catch {
        this.preview = null
      }
      return this.preview
    },

    neighbours(slug) {
      const list = this.projects
      const i = list.findIndex((p) => p.slug === slug)
      if (i === -1 || list.length < 2) return { index: i, prev: null, next: null }
      return {
        index: i,
        prev: list[(i - 1 + list.length) % list.length],
        next: list[(i + 1) % list.length],
      }
    },

    /** Called by the back office after a save so the public pages are fresh. */
    invalidate() {
      this.loaded = false
      this.projects = []
      this.preview = null
      this.bust = Date.now()
    },
  },
})
