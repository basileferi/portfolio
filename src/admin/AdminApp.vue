<template>
  <div class="adm">
    <div v-if="state === 'loading'" class="adm-center">
      <span class="adm-spinner" aria-hidden="true" /> Chargement…
    </div>

    <AdminLogin v-else-if="state === 'login'" :notice="notice" @logged-in="onLoggedIn" />

    <template v-else>
      <header class="adm-top">
        <RouterLink :to="ADMIN_PATH" class="adm-brand" @click="closeEditor">
          Kosmo<span>.</span> <b>Studio</b>
        </RouterLink>
        <div class="adm-top-right">
          <span class="adm-user">{{ username }}</span>
          <a href="/projects" target="_blank" rel="noopener" class="adm-btn adm-btn--ghost">Voir le site ↗</a>
          <button type="button" class="adm-btn adm-btn--ghost" @click="logout">Déconnexion</button>
        </div>
      </header>

      <main class="adm-main">
        <AdminEditor
          v-if="editing"
          :key="editKey"
          :project="current"
          :categories="categories"
          @saved="onSaved"
          @close="closeEditor"
        />
        <AdminDashboard
          v-else
          :projects="projects"
          :loading="listLoading"
          @create="openEditor('new')"
          @edit="(p) => openEditor(p.id)"
          @updated="onUpdated"
          @removed="onRemoved"
          @reordered="onReordered"
        />
      </main>
    </template>

    <div class="adm-toasts" aria-live="polite">
      <TransitionGroup name="toast">
        <p v-for="t in toasts" :key="t.id" class="adm-toast" :class="`adm-toast--${t.type}`">{{ t.message }}</p>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ADMIN_PATH } from '@/router'
import { api, ApiError } from './api'
import { toasts, toast } from './toast'
import { enablePageScroll, disablePageScroll } from '@/composables/useSmoothScroll'
import { useProjectsStore } from '@/stores/useProjectsStore'
import AdminLogin from './AdminLogin.vue'
import AdminDashboard from './AdminDashboard.vue'
import AdminEditor from './AdminEditor.vue'

// Never type the password over plain HTTP.
if (location.protocol === 'http:' && !['localhost', '127.0.0.1'].includes(location.hostname)) {
  location.replace(`https://${location.host}${location.pathname}${location.search}`)
}

const route = useRoute()
const router = useRouter()
const publicStore = useProjectsStore()

const state = ref('loading') // loading | login | ready
const notice = ref('')
const username = ref('')
const projects = ref([])
const listLoading = ref(false)

const editParam = computed(() => route.query.edit)
const editing = computed(() => state.value === 'ready' && !!editParam.value)
const current = computed(() => {
  if (editParam.value === 'new') return null
  return projects.value.find((p) => String(p.id) === String(editParam.value)) || null
})
const editKey = computed(() => String(editParam.value || ''))
const categories = computed(() => [...new Set(projects.value.map((p) => p.category).filter(Boolean))])

function handleError(err) {
  if (err instanceof ApiError && (err.status === 401 || err.status === 419)) {
    state.value = 'login'
    notice.value = 'Session expirée : reconnectez-vous.'
    return
  }
  toast(err.message || 'Erreur inattendue', 'error', 6000)
}

async function loadProjects() {
  listLoading.value = true
  try {
    projects.value = await api.projects()
  } catch (err) {
    handleError(err)
  } finally {
    listLoading.value = false
  }
}

async function onLoggedIn(me) {
  username.value = me.username
  notice.value = ''
  state.value = 'ready'
  await loadProjects()
}

async function logout() {
  try { await api.logout() } catch { /* ignore */ }
  projects.value = []
  state.value = 'login'
  notice.value = 'Vous êtes déconnecté.'
  router.replace({ path: ADMIN_PATH })
}

function openEditor(id) {
  router.push({ path: ADMIN_PATH, query: { edit: String(id) } })
  window.scrollTo({ top: 0 })
}

function closeEditor() {
  if (route.query.edit) router.push({ path: ADMIN_PATH })
}

function upsert(project) {
  const i = projects.value.findIndex((p) => p.id === project.id)
  if (i > -1) projects.value.splice(i, 1, project)
  else projects.value.unshift(project)
  publicStore.invalidate()
}

function onSaved(project, { stay } = {}) {
  upsert(project)
  if (stay) router.replace({ path: ADMIN_PATH, query: { edit: String(project.id) } })
  else closeEditor()
}

const onUpdated = (project) => upsert(project)
function onRemoved(id) {
  projects.value = projects.value.filter((p) => p.id !== id)
  publicStore.invalidate()
}
function onReordered(list) {
  projects.value = list
  publicStore.invalidate()
}

// If the URL points to a project that no longer exists, go back to the list.
watch([editParam, () => projects.value.length], () => {
  if (editing.value && editParam.value !== 'new' && !listLoading.value && projects.value.length && !current.value) closeEditor()
})

onMounted(async () => {
  enablePageScroll()
  document.title = 'Studio — Kosmo.'
  try {
    const me = await api.me()
    if (me.authenticated) await onLoggedIn(me)
    else state.value = 'login'
  } catch (err) {
    state.value = 'login'
    notice.value = err.message
  }
})

onBeforeUnmount(disablePageScroll)
</script>

<style>
/* Shared back-office design tokens & primitives (unscoped on purpose). */
.adm {
  --a-bg: #0f100f;
  --a-panel: #181918;
  --a-panel-2: #1f201f;
  --a-line: rgba(255, 255, 255, 0.1);
  --a-text: #f2f2f2;
  --a-soft: #a8a8a8;
  --a-accent: var(--color-accent, #897eff);
  --a-danger: #ff6b6b;
  --a-ok: #4ade80;
  --a-warn: #fbbf24;
  min-height: 100vh;
  background: var(--a-bg);
  color: var(--a-text);
  font-family: var(--font-body), system-ui, sans-serif;
  font-size: 15px;
  line-height: 1.5;
}
.adm *:focus-visible { outline: 2px solid var(--a-accent); outline-offset: 2px; }
.adm h1, .adm h2, .adm h3 { font-family: var(--font-body), system-ui, sans-serif; font-weight: 800; }

.adm-center { min-height: 100vh; display: grid; place-items: center; color: var(--a-soft); grid-auto-flow: column; gap: 0.75rem; justify-content: center; }
.adm-spinner { width: 1rem; height: 1rem; border-radius: 50%; border: 2px solid var(--a-line); border-top-color: var(--a-accent); animation: adm-spin 0.8s linear infinite; display: inline-block; }
@keyframes adm-spin { to { transform: rotate(360deg); } }

.adm-top {
  position: sticky; top: 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  padding: 0.85rem clamp(1rem, 3vw, 2rem);
  background: rgba(15, 16, 15, 0.85); backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--a-line);
}
.adm-brand { font-family: var(--font-display), sans-serif; font-size: 1.2rem; color: var(--a-text); text-decoration: none; }
.adm-brand span { color: var(--a-accent); }
.adm-brand b { font-family: var(--font-body), sans-serif; font-weight: 800; font-size: 0.75rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--a-soft); margin-left: 0.35rem; }
.adm-top-right { display: flex; align-items: center; gap: 0.5rem; }
.adm-user { color: var(--a-soft); font-size: 0.85rem; margin-right: 0.5rem; }

.adm-main { max-width: 1200px; margin: 0 auto; padding: clamp(1.25rem, 3vw, 2.5rem) clamp(1rem, 3vw, 2rem) 8rem; }

.adm-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
  height: 2.4rem; padding: 0 1rem; border-radius: 8px;
  border: 1px solid var(--a-line); background: var(--a-panel-2); color: var(--a-text);
  font: 700 0.85rem/1 var(--font-body), sans-serif; text-decoration: none; cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, opacity 0.2s;
  white-space: nowrap;
}
.adm-btn:hover { border-color: rgba(255, 255, 255, 0.3); }
.adm-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.adm-btn--primary { background: var(--a-accent); border-color: var(--a-accent); color: #0b0b0b; }
.adm-btn--primary:hover { background: #a39bff; border-color: #a39bff; }
.adm-btn--ghost { background: transparent; }
.adm-btn--danger { color: var(--a-danger); }
.adm-btn--danger:hover { border-color: var(--a-danger); background: rgba(255, 107, 107, 0.08); }
.adm-btn--sm { height: 2rem; padding: 0 0.7rem; font-size: 0.8rem; }
.adm-btn--icon { width: 2rem; padding: 0; }

.adm-input, .adm-textarea, .adm-select {
  width: 100%; padding: 0.65rem 0.8rem; border-radius: 8px;
  border: 1px solid var(--a-line); background: var(--a-bg); color: var(--a-text);
  font: 400 0.95rem/1.45 var(--font-body), sans-serif;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.adm-input:focus, .adm-textarea:focus { outline: none; border-color: var(--a-accent); box-shadow: 0 0 0 3px rgba(137, 126, 255, 0.2); }
.adm-textarea { resize: vertical; min-height: 6rem; }
.adm-label { display: block; font-weight: 700; font-size: 0.85rem; margin-bottom: 0.4rem; }
.adm-label small { font-weight: 400; color: var(--a-soft); margin-left: 0.3rem; }
.adm-help { margin-top: 0.35rem; font-size: 0.8rem; color: var(--a-soft); }
.adm-req { color: var(--a-accent); }

.adm-toasts { position: fixed; right: 1.25rem; bottom: 1.25rem; z-index: 9999; display: grid; gap: 0.5rem; max-width: min(420px, calc(100vw - 2.5rem)); }
.adm-toast { margin: 0; padding: 0.8rem 1rem; border-radius: 10px; background: var(--a-panel-2); border: 1px solid var(--a-line); border-left: 4px solid var(--a-ok); box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4); font-size: 0.9rem; }
.adm-toast--error { border-left-color: var(--a-danger); }
.adm-toast--info { border-left-color: var(--a-accent); }
.toast-enter-active, .toast-leave-active { transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }

@media (max-width: 640px) {
  .adm-user { display: none; }
}
</style>
