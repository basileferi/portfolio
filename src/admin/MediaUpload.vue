<template>
  <div class="mu" :class="{ multiple }">
    <!-- Current images -->
    <ul v-if="items.length" class="mu-items">
      <li v-for="(src, i) in items" :key="src + i" class="mu-item">
        <img :src="src" alt="" loading="lazy" />
        <div class="mu-item-bar">
          <template v-if="multiple">
            <button type="button" class="mu-ico" :disabled="i === 0" :aria-label="`Déplacer l'image ${i + 1} vers la gauche`" @click="move(i, -1)">←</button>
            <span class="mu-n">{{ i + 1 }}</span>
            <button type="button" class="mu-ico" :disabled="i === items.length - 1" :aria-label="`Déplacer l'image ${i + 1} vers la droite`" @click="move(i, 1)">→</button>
            <button type="button" class="mu-ico mu-cover" title="Utiliser comme couverture" :aria-label="`Utiliser l'image ${i + 1} comme couverture`" @click="$emit('set-cover', src)">★</button>
          </template>
          <button type="button" class="mu-ico mu-del" :aria-label="`Retirer l'image ${i + 1}`" @click="removeAt(i)">✕</button>
        </div>
      </li>
    </ul>

    <!-- Uploads in progress -->
    <ul v-if="queue.length" class="mu-queue">
      <li v-for="q in queue" :key="q.id">
        <span class="mu-q-name">{{ q.name }}</span>
        <span class="mu-q-bar"><i :style="{ width: `${Math.round(q.progress * 100)}%` }" /></span>
        <span class="mu-q-state">{{ q.state }}</span>
      </li>
    </ul>

    <!-- Drop zone -->
    <label
      v-if="multiple || !items.length"
      class="mu-drop"
      :class="{ hover: dragging }"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" :multiple="multiple" class="sr-only" @change="onPick" />
      <span class="mu-drop-ico" aria-hidden="true">⤒</span>
      <span><b>Cliquez</b> ou déposez {{ multiple ? 'des images' : 'une image' }} ici</span>
      <small>JPG, PNG, WebP, GIF — redimensionnées automatiquement</small>
    </label>
    <button v-else type="button" class="adm-btn adm-btn--sm mu-replace" @click="removeAt(0)">Remplacer l'image</button>

    <details class="mu-url">
      <summary>Ou ajouter par URL</summary>
      <div class="mu-url-row">
        <input v-model.trim="urlDraft" class="adm-input" placeholder="https://… ou /projects/mon-projet/1.png" @keydown.enter.prevent="addUrl" />
        <button type="button" class="adm-btn adm-btn--sm" :disabled="!urlDraft" @click="addUrl">Ajouter</button>
      </div>
    </details>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { api } from './api'
import { compressImage } from './imageCompress'
import { toast } from './toast'

const props = defineProps({
  modelValue: { type: [String, Array], default: '' },
  multiple: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue', 'set-cover', 'busy'])

const dragging = ref(false)
const queue = ref([])
const urlDraft = ref('')
let qid = 0

const items = computed(() => {
  if (props.multiple) return Array.isArray(props.modelValue) ? props.modelValue : []
  return props.modelValue ? [props.modelValue] : []
})

function commit(list) {
  emit('update:modelValue', props.multiple ? list : (list[list.length - 1] || ''))
}

function removeAt(i) {
  const list = items.value.slice()
  list.splice(i, 1)
  commit(list)
}

function move(i, delta) {
  const list = items.value.slice()
  const j = i + delta
  ;[list[i], list[j]] = [list[j], list[i]]
  commit(list)
}

function addUrl() {
  const url = urlDraft.value
  if (!/^(https?:\/\/|\/(?!\/))/i.test(url)) {
    toast('URL invalide : commencez par https:// ou /', 'error')
    return
  }
  commit(props.multiple ? [...items.value, url] : [url])
  urlDraft.value = ''
}

async function handleFiles(fileList) {
  const files = [...fileList].filter((f) => f.type.startsWith('image/'))
  if (!files.length) return
  const selected = props.multiple ? files : files.slice(0, 1)
  emit('busy', true)
  const uploaded = []
  for (const file of selected) {
    const entry = { id: ++qid, name: file.name, progress: 0, state: 'Optimisation…' }
    queue.value.push(entry)
    const live = queue.value[queue.value.length - 1] // reactive proxy
    try {
      const optimised = await compressImage(file)
      live.state = 'Envoi…'
      const url = await api.upload(optimised, (p) => { live.progress = p })
      live.progress = 1
      uploaded.push(url)
      // Commit after each file so a later failure never loses earlier uploads.
      commit(props.multiple ? [...items.value, url] : [url])
    } catch (err) {
      toast(`${file.name} : ${err.message}`, 'error', 6000)
    } finally {
      queue.value = queue.value.filter((q) => q.id !== entry.id)
    }
  }
  emit('busy', false)
  if (uploaded.length) toast(uploaded.length > 1 ? `${uploaded.length} images ajoutées.` : 'Image ajoutée.', 'info', 2000)
}

function onPick(e) {
  handleFiles(e.target.files)
  e.target.value = ''
}

function onDrop(e) {
  dragging.value = false
  handleFiles(e.dataTransfer.files)
}
</script>

<style scoped>
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

.mu-items { list-style: none; margin: 0 0 0.75rem; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.6rem; }
.mu:not(.multiple) .mu-items { grid-template-columns: minmax(0, 360px); }
.mu-item { position: relative; border-radius: 10px; overflow: hidden; background: var(--a-panel-2); aspect-ratio: 4 / 3; border: 1px solid var(--a-line); }
.mu-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
.mu-item-bar {
  position: absolute; inset: auto 0 0 0; display: flex; align-items: center; justify-content: flex-end; gap: 0.25rem;
  padding: 0.35rem; background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
}
.mu-n { flex: 1; text-align: center; font-size: 0.75rem; font-weight: 700; }
.mu-ico {
  width: 1.75rem; height: 1.75rem; display: grid; place-items: center; border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2); background: rgba(0, 0, 0, 0.55); color: #fff; font-size: 0.8rem; cursor: pointer;
}
.mu-ico:disabled { opacity: 0.3; cursor: default; }
.mu-ico:hover:not(:disabled) { background: var(--a-accent); color: #000; }
.mu-del:hover:not(:disabled) { background: var(--a-danger); }
.mu-cover { color: var(--a-warn); }

.mu-queue { list-style: none; margin: 0 0 0.75rem; padding: 0; display: grid; gap: 0.4rem; font-size: 0.8rem; }
.mu-queue li { display: grid; grid-template-columns: minmax(0, 1fr) 120px 90px; gap: 0.6rem; align-items: center; }
.mu-q-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mu-q-bar { height: 4px; border-radius: 2px; background: var(--a-line); overflow: hidden; }
.mu-q-bar i { display: block; height: 100%; background: var(--a-accent); transition: width 0.2s ease; }
.mu-q-state { color: var(--a-soft); text-align: right; }

.mu-drop {
  display: grid; justify-items: center; gap: 0.3rem; padding: 1.5rem 1rem; text-align: center;
  border: 1.5px dashed rgba(255, 255, 255, 0.2); border-radius: 12px; background: var(--a-bg);
  color: var(--a-soft); cursor: pointer; transition: border-color 0.2s ease, background-color 0.2s ease;
}
.mu-drop b { color: var(--a-text); }
.mu-drop small { font-size: 0.75rem; }
.mu-drop:hover, .mu-drop.hover, .mu-drop:focus-within { border-color: var(--a-accent); background: rgba(137, 126, 255, 0.06); }
.mu-drop-ico { font-size: 1.4rem; color: var(--a-accent); }
.mu-replace { margin-bottom: 0.5rem; }

.mu-url { margin-top: 0.6rem; font-size: 0.82rem; color: var(--a-soft); }
.mu-url summary { cursor: pointer; }
.mu-url-row { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
</style>
