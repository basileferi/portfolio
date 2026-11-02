<template>
  <section class="dash">
    <header class="dash-head">
      <div>
        <h1 class="dash-title">Projets</h1>
        <p class="dash-stats">
          <span><b>{{ publishedCount }}</b> publiés</span>
          <span><b>{{ projects.length - publishedCount }}</b> brouillons</span>
        </p>
      </div>
      <button type="button" class="adm-btn adm-btn--primary dash-new" @click="$emit('create')">+ Nouveau projet</button>
    </header>

    <div class="dash-tools">
      <input v-model="query" class="adm-input dash-search" type="search" placeholder="Rechercher un projet…" aria-label="Rechercher un projet" />
      <p class="adm-help">L'ordre de la liste = l'ordre sur le site. Glissez-déposez ou utilisez ↑ ↓.</p>
    </div>

    <p v-if="loading && !projects.length" class="dash-empty"><span class="adm-spinner" /> Chargement des projets…</p>
    <div v-else-if="!projects.length" class="dash-empty">
      <p>Aucun projet pour l'instant.</p>
      <button type="button" class="adm-btn adm-btn--primary" @click="$emit('create')">Créer le premier projet</button>
    </div>

    <ol v-else class="dash-list">
      <li
        v-for="p in visible"
        :key="p.id"
        class="dash-row"
        :class="{ dragging: dragId === p.id, over: overId === p.id, draft: !p.published }"
        :draggable="!query"
        @dragstart="onDragStart(p, $event)"
        @dragover.prevent="overId = p.id"
        @dragleave="overId = overId === p.id ? null : overId"
        @drop.prevent="onDrop(p)"
        @dragend="dragId = overId = null"
      >
        <span v-if="!query" class="dash-handle" aria-hidden="true" title="Glisser pour réordonner">⋮⋮</span>
        <button type="button" class="dash-thumb" :aria-label="`Modifier ${p.title}`" @click="$emit('edit', p)">
          <img v-if="p.preview" :src="p.preview" alt="" loading="lazy" />
          <span v-else>—</span>
        </button>

        <div class="dash-info">
          <button type="button" class="dash-name" @click="$emit('edit', p)">{{ p.title }}</button>
          <p class="dash-meta">
            <span class="dash-slug">/projects/{{ p.slug }}</span>
            <span v-if="p.category">· {{ p.category }}</span>
            <span v-if="p.year">· {{ p.year }}</span>
            <span v-if="p.slug.startsWith('ancien-projet-')" class="dash-legacy">ancienne fiche</span>
          </p>
        </div>

        <button
          type="button"
          class="dash-status"
          :class="{ on: p.published }"
          :aria-pressed="p.published"
          :disabled="busyId === p.id"
          :title="p.published ? 'Cliquer pour dépublier' : 'Cliquer pour publier'"
          @click="togglePublish(p)"
        >
          <i aria-hidden="true" />{{ p.published ? 'Publié' : 'Brouillon' }}
        </button>

        <div class="dash-actions">
          <template v-if="!query">
            <button type="button" class="adm-btn adm-btn--sm adm-btn--icon" :disabled="indexOf(p) === 0" :aria-label="`Monter ${p.title}`" @click="move(p, -1)">↑</button>
            <button type="button" class="adm-btn adm-btn--sm adm-btn--icon" :disabled="indexOf(p) === projects.length - 1" :aria-label="`Descendre ${p.title}`" @click="move(p, 1)">↓</button>
          </template>
          <a class="adm-btn adm-btn--sm adm-btn--ghost" :href="previewUrl(p)" target="_blank" rel="noopener">Voir</a>
          <button type="button" class="adm-btn adm-btn--sm" @click="$emit('edit', p)">Modifier</button>
          <button type="button" class="adm-btn adm-btn--sm adm-btn--danger" :disabled="busyId === p.id" @click="remove(p)">Supprimer</button>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { api } from './api'
import { toast } from './toast'

const props = defineProps({
  projects: { type: Array, required: true },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['create', 'edit', 'updated', 'removed', 'reordered'])

const query = ref('')
const busyId = ref(null)
const dragId = ref(null)
const overId = ref(null)

const publishedCount = computed(() => props.projects.filter((p) => p.published).length)
const visible = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.projects
  return props.projects.filter((p) => [p.title, p.slug, p.category, p.tech_stack].join(' ').toLowerCase().includes(q))
})
const indexOf = (p) => props.projects.indexOf(p)
const previewUrl = (p) => `/projects/${encodeURIComponent(p.slug)}${p.published ? '' : '?preview=1'}`

async function togglePublish(p) {
  busyId.value = p.id
  try {
    const updated = await api.publish(p.id, !p.published)
    emit('updated', updated)
    toast(updated.published ? `« ${p.title} » est en ligne.` : `« ${p.title} » repasse en brouillon.`)
  } catch (err) {
    toast(err.message, 'error')
  } finally {
    busyId.value = null
  }
}

async function remove(p) {
  if (!window.confirm(`Supprimer définitivement « ${p.title} » ?\nCette action est irréversible.`)) return
  busyId.value = p.id
  try {
    await api.remove(p.id)
    emit('removed', p.id)
    toast(`« ${p.title} » supprimé.`)
  } catch (err) {
    toast(err.message, 'error')
  } finally {
    busyId.value = null
  }
}

async function commitOrder(list) {
  const previous = props.projects.slice()
  emit('reordered', list) // optimistic
  try {
    await api.reorder(list.map((p) => p.id))
    toast('Ordre enregistré.', 'info', 1800)
  } catch (err) {
    emit('reordered', previous)
    toast(err.message, 'error')
  }
}

function move(p, delta) {
  const list = props.projects.slice()
  const i = list.indexOf(p)
  const j = i + delta
  if (j < 0 || j >= list.length) return
  ;[list[i], list[j]] = [list[j], list[i]]
  commitOrder(list)
}

function onDragStart(p, e) {
  dragId.value = p.id
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', String(p.id))
}

function onDrop(target) {
  const from = props.projects.findIndex((p) => p.id === dragId.value)
  const to = props.projects.indexOf(target)
  dragId.value = overId.value = null
  if (from < 0 || to < 0 || from === to) return
  const list = props.projects.slice()
  const [moved] = list.splice(from, 1)
  list.splice(to, 0, moved)
  commitOrder(list)
}
</script>

<style scoped>
.dash-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; flex-wrap: wrap; }
.dash-title { font-size: clamp(1.8rem, 4vw, 2.6rem); margin: 0; letter-spacing: -0.02em; }
.dash-stats { display: flex; gap: 1rem; margin: 0.3rem 0 0; color: var(--a-soft); font-size: 0.9rem; }
.dash-stats b { color: var(--a-text); }
.dash-new { height: 2.8rem; padding: 0 1.4rem; font-size: 0.95rem; }

.dash-tools { margin: 1.75rem 0 1rem; }
.dash-search { max-width: 420px; }

.dash-empty { display: grid; justify-items: start; gap: 1rem; padding: 3rem 0; color: var(--a-soft); }

.dash-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.dash-row {
  display: grid;
  grid-template-columns: auto 88px minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem 0.75rem 0.75rem;
  border-radius: 12px;
  border: 1px solid var(--a-line);
  background: var(--a-panel);
  transition: border-color 0.2s ease, background-color 0.2s ease, opacity 0.2s ease;
}
.dash-row:hover { border-color: rgba(255, 255, 255, 0.2); }
.dash-row.dragging { opacity: 0.4; }
.dash-row.over { border-color: var(--a-accent); background: rgba(137, 126, 255, 0.08); }
.dash-row.draft .dash-thumb img { filter: grayscale(0.8); opacity: 0.6; }

.dash-handle { cursor: grab; color: var(--a-soft); letter-spacing: -0.2em; user-select: none; padding: 0 0.2rem; }
.dash-thumb {
  width: 88px; height: 60px; padding: 0; border: 0; border-radius: 8px; overflow: hidden;
  background: var(--a-panel-2); color: var(--a-soft); cursor: pointer;
}
.dash-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

.dash-info { min-width: 0; }
.dash-name {
  padding: 0; border: 0; background: none; color: var(--a-text); cursor: pointer;
  font: 800 1.02rem/1.3 var(--font-body), sans-serif; text-align: left;
}
.dash-name:hover { color: var(--a-accent); }
.dash-meta { display: flex; flex-wrap: wrap; gap: 0.35rem; margin: 0.2rem 0 0; font-size: 0.8rem; color: var(--a-soft); }
.dash-slug { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
.dash-legacy { padding: 0 0.45rem; border-radius: 999px; background: rgba(251, 191, 36, 0.15); color: var(--a-warn); }

.dash-status {
  display: inline-flex; align-items: center; gap: 0.45rem;
  height: 2rem; padding: 0 0.8rem; border-radius: 999px;
  border: 1px solid var(--a-line); background: transparent; color: var(--a-soft);
  font: 700 0.78rem/1 var(--font-body), sans-serif; cursor: pointer;
}
.dash-status i { width: 0.5rem; height: 0.5rem; border-radius: 50%; background: var(--a-soft); }
.dash-status.on { color: var(--a-ok); border-color: rgba(74, 222, 128, 0.35); }
.dash-status.on i { background: var(--a-ok); box-shadow: 0 0 8px var(--a-ok); }

.dash-actions { display: flex; flex-wrap: wrap; gap: 0.35rem; justify-content: flex-end; }

@media (max-width: 900px) {
  .dash-row { grid-template-columns: 72px minmax(0, 1fr) auto; }
  .dash-handle { display: none; }
  .dash-thumb { width: 72px; height: 50px; }
  .dash-actions { grid-column: 1 / -1; justify-content: flex-start; }
}
</style>
