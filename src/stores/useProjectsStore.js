import { defineStore } from 'pinia'
import { normalizeProject } from '@/data/normalizeProject.js'
import { locale } from '@/i18n'

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
    raw: [], // projects as sent by the API (French + `_en` columns)
    loaded: false,
    error: null, // set when the API is unreachable (the database is the only source)
    rawPreview: null, // draft opened by the admin with ?preview=1
    bust: 0, // cache-buster after a back-office save
  }),

  getters: {
    /** Published projects in the current language (recomputed when the language changes). */
    projects: (state) => state.raw.map((p) => normalizeProject(p, locale.value)).filter((p) => p.slug),
    preview: (state) => (state.rawPreview ? normalizeProject(state.rawPreview, locale.value) : null),
    categories() {
      return [...new Set(this.projects.map((p) => p.category).filter(Boolean))]
    },
  },

  actions: {
    /** Loads the published projects once, from the back-office API (database). */
    load() {
      if (this.loaded) return Promise.resolve(this.projects)
      if (pending) return pending
      pending = fetchJson(this.bust ? `/api/projects.php?v=${this.bust}` : '/api/projects.php')
        .then((data) => {
          const list = Array.isArray(data?.projects) ? data.projects : []
          this.raw = list.filter((p) => p && p.slug)
          this.error = null
        })
        .catch((err) => {
          console.error('[projects] API unavailable:', err.message)
          this.raw = []
          this.error = err.message
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
        this.rawPreview = (data?.projects || []).find((p) => p.slug === slug) || null
      } catch {
        this.rawPreview = null
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
      this.raw = []
      this.rawPreview = null
      this.bust = Date.now()
    },
  },
})
