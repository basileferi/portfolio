<template>
  <form class="ed" novalidate @submit.prevent="save(false)">
    <header class="ed-head">
      <button type="button" class="adm-btn adm-btn--ghost adm-btn--sm" @click="close">← Retour à la liste</button>
      <h1 class="ed-title">{{ isNew ? 'Nouveau projet' : form.title || 'Sans titre' }}</h1>
      <p class="ed-sub">
        Les champs marqués <span class="adm-req">*</span> sont obligatoires. Tout le reste est optionnel :
        une section vide n'apparaît pas sur le site.
      </p>
    </header>

    <p v-if="error" class="ed-error" role="alert">{{ error }}</p>

    <!-- ============ 1. Essentiel ============ -->
    <fieldset class="ed-card">
      <legend><span>1</span> L'essentiel</legend>
      <div class="ed-grid">
        <div class="ed-field ed-span-2">
          <label class="adm-label" for="f-title">Titre <span class="adm-req">*</span></label>
          <input id="f-title" v-model="form.title" class="adm-input ed-input-lg" maxlength="255" required placeholder="Ex. Kosmo." @input="onTitleInput" />
        </div>
        <div class="ed-field ed-span-2">
          <label class="adm-label" for="f-slug">Adresse de la page <small>générée depuis le titre</small></label>
          <div class="ed-prefix">
            <span>/projects/</span>
            <input id="f-slug" v-model="form.slug" class="adm-input" maxlength="191" placeholder="mon-projet" @input="slugTouched = true" @blur="form.slug = slugify(form.slug)" />
          </div>
        </div>
        <div class="ed-field ed-span-2">
          <label class="adm-label" for="f-subtitle">Accroche <small>une phrase qui résume le projet</small></label>
          <input id="f-subtitle" v-model="form.subtitle" class="adm-input" maxlength="255" placeholder="Ex. Site de notation de jeux vidéo" />
        </div>
        <div class="ed-field">
          <label class="adm-label" for="f-category">Catégorie</label>
          <input id="f-category" v-model="form.category" class="adm-input" list="ed-categories" maxlength="255" placeholder="Développement Web" />
          <datalist id="ed-categories"><option v-for="c in categoryOptions" :key="c" :value="c" /></datalist>
        </div>
        <div class="ed-field">
          <label class="adm-label" for="f-year">Année</label>
          <input id="f-year" v-model="form.year" class="adm-input" maxlength="16" inputmode="numeric" :placeholder="String(new Date().getFullYear())" />
        </div>
      </div>
    </fieldset>

    <!-- ============ 2. Recruteurs ============ -->
    <fieldset class="ed-card">
      <legend><span>2</span> En bref <small>— ce qu'un recruteur lit en 10 secondes</small></legend>
      <div class="ed-grid">
        <div class="ed-field">
          <label class="adm-label" for="f-role">Mon rôle</label>
          <input id="f-role" v-model="form.role" class="adm-input" maxlength="120" placeholder="Développeur full-stack" />
        </div>
        <div class="ed-field">
          <label class="adm-label" for="f-context">Contexte</label>
          <input id="f-context" v-model="form.context" class="adm-input" maxlength="120" list="ed-contexts" placeholder="Projet étudiant, Stage, Freelance…" />
          <datalist id="ed-contexts">
            <option value="Projet personnel" /><option value="Projet étudiant" /><option value="Stage" /><option value="Alternance" /><option value="Freelance" />
          </datalist>
        </div>
        <div class="ed-field ed-span-2">
          <label class="adm-label" for="f-stack">Technologies <small>séparées par des virgules</small></label>
          <input id="f-stack" v-model="form.tech_stack" class="adm-input" maxlength="500" placeholder="Vue 3, PHP, MariaDB" />
          <ul v-if="stackPreview.length" class="ed-chips" aria-label="Aperçu des technologies">
            <li v-for="t in stackPreview" :key="t">{{ t }}</li>
          </ul>
        </div>
        <div class="ed-field ed-span-2">
          <label class="adm-label" for="f-highlights">Points clés <small>un par ligne — 3 à 5 idéalement</small></label>
          <textarea id="f-highlights" v-model="form.highlights" class="adm-textarea" rows="4" placeholder="API REST avec documentation Swagger&#10;Temps de chargement réduit de 30 %&#10;Livré en autonomie" />
        </div>
      </div>
    </fieldset>

    <!-- ============ 3. Description ============ -->
    <fieldset class="ed-card">
      <legend><span>3</span> Description</legend>
      <div class="ed-tabs" role="tablist">
        <button type="button" role="tab" :aria-selected="descTab === 'write'" :class="{ active: descTab === 'write' }" @click="descTab = 'write'">Écrire</button>
        <button type="button" role="tab" :aria-selected="descTab === 'preview'" :class="{ active: descTab === 'preview' }" @click="descTab = 'preview'">Aperçu</button>
      </div>

      <div v-show="descTab === 'write'">
        <div class="ed-toolbar" role="toolbar" aria-label="Mise en forme">
          <button type="button" title="Paragraphe" @click="wrapBlock('p')">¶</button>
          <button type="button" title="Intertitre" @click="wrapBlock('h3')">H</button>
          <button type="button" title="Gras" @click="wrapInline('strong')"><b>B</b></button>
          <button type="button" title="Italique" @click="wrapInline('em')"><i>I</i></button>
          <button type="button" title="Liste à puces" @click="makeList">• Liste</button>
          <button type="button" title="Lien" @click="makeLink">Lien</button>
        </div>
        <textarea
          id="f-description"
          ref="descEl"
          v-model="form.description"
          class="adm-textarea ed-desc"
          rows="12"
          placeholder="Décrivez le projet : objectif, votre démarche, les défis, le résultat…"
        />
        <p class="adm-help">
          Du texte simple suffit : laissez une ligne vide entre deux paragraphes.
          Les boutons ci-dessus ajoutent la mise en forme (HTML nettoyé automatiquement à l'enregistrement).
        </p>
      </div>
      <div v-show="descTab === 'preview'" class="ed-preview" v-html="descriptionPreview" />
    </fieldset>

    <!-- ============ 4. Médias ============ -->
    <fieldset class="ed-card">
      <legend><span>4</span> Images & vidéo</legend>
      <div class="ed-field">
        <p class="adm-label">Image de couverture <small>affichée en grand + vignettes (paysage 16:9 idéal)</small></p>
        <MediaUpload v-model="form.image" @busy="(b) => (uploading = b)" />
      </div>
      <div class="ed-field">
        <p class="adm-label">Galerie <small>captures d'écran, maquettes… ★ = utiliser comme couverture</small></p>
        <MediaUpload v-model="form.media" multiple @set-cover="(src) => (form.image = src)" @busy="(b) => (uploading = b)" />
      </div>
      <div class="ed-field">
        <label class="adm-label" for="f-video">Vidéo <small>lien YouTube, Vimeo ou fichier .mp4</small></label>
        <input id="f-video" v-model.trim="form.video" class="adm-input" maxlength="255" placeholder="https://www.youtube.com/watch?v=…" />
      </div>
    </fieldset>

    <!-- ============ 5. Liens ============ -->
    <fieldset class="ed-card">
      <legend><span>5</span> Liens</legend>
      <div class="ed-grid">
        <div class="ed-field">
          <label class="adm-label" for="f-link">Voir le projet en ligne</label>
          <input id="f-link" v-model.trim="form.link" class="adm-input" maxlength="255" placeholder="https://…" />
        </div>
        <div class="ed-field">
          <label class="adm-label" for="f-repo">Code source</label>
          <input id="f-repo" v-model.trim="form.repo" class="adm-input" maxlength="255" placeholder="https://github.com/…" />
        </div>
      </div>
    </fieldset>

    <!-- ============ 6. Publication ============ -->
    <fieldset class="ed-card ed-publish">
      <legend><span>6</span> Publication</legend>
      <label class="ed-switch">
        <input v-model="form.published" type="checkbox" />
        <span class="ed-switch-ui" aria-hidden="true" />
        <span>
          <b>{{ form.published ? 'Publié' : 'Brouillon' }}</b>
          <small>{{ form.published ? 'Visible par tous les visiteurs.' : 'Visible uniquement par vous (bouton Aperçu).' }}</small>
        </span>
      </label>
    </fieldset>

    <!-- ============ Sticky actions ============ -->
    <div class="ed-bar">
      <span class="ed-bar-state" :class="{ dirty }">{{ dirty ? 'Modifications non enregistrées' : (isNew ? 'Nouveau projet' : 'Tout est enregistré') }}</span>
      <a v-if="!isNew" class="adm-btn adm-btn--ghost" :href="previewUrl" target="_blank" rel="noopener" title="Ouvre la dernière version enregistrée">Aperçu ↗</a>
      <button type="button" class="adm-btn" :disabled="busy || uploading" @click="save(true)">Enregistrer</button>
      <button type="submit" class="adm-btn adm-btn--primary" :disabled="busy || uploading">
        <span v-if="busy" class="adm-spinner" aria-hidden="true" />
        {{ uploading ? 'Envoi des images…' : 'Enregistrer et fermer' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { api } from './api'
import { toast } from './toast'
import MediaUpload from './MediaUpload.vue'

const props = defineProps({
  project: { type: Object, default: null },
  categories: { type: Array, default: () => [] },
})
const emit = defineEmits(['saved', 'close'])

const isNew = computed(() => !props.project?.id)

function toForm(p) {
  return {
    id: p?.id ?? null,
    title: p?.title ?? '',
    slug: p?.slug ?? '',
    subtitle: p?.subtitle ?? '',
    category: p?.category ?? '',
    year: p?.year ?? String(new Date().getFullYear()),
    context: p?.context ?? '',
    role: p?.role ?? '',
    tech_stack: p?.tech_stack ?? '',
    highlights: Array.isArray(p?.highlights) ? p.highlights.join('\n') : (p?.highlights ?? ''),
    description: p?.description ?? '',
    image: p?.image ?? '',
    media: Array.isArray(p?.media) ? [...p.media] : [],
    video: p?.video ?? '',
    link: p?.link ?? '',
    repo: p?.repo ?? '',
    published: p ? !!p.published : false,
  }
}

const form = reactive(toForm(props.project))
let snapshot = JSON.stringify(form)
const dirty = computed(() => JSON.stringify(form) !== snapshot)

const busy = ref(false)
const uploading = ref(false)
const error = ref('')
const descTab = ref('write')
const descEl = ref(null)
const slugTouched = ref(!!props.project?.slug)

const categoryOptions = computed(() => [...new Set(['Développement Web', 'Design', 'Graphisme', '3D', ...props.categories])])
const stackPreview = computed(() => form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean))
const previewUrl = computed(() => `/projects/${encodeURIComponent(props.project?.slug || form.slug)}${props.project?.published ? '' : '?preview=1'}`)

function slugify(text) {
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

function onTitleInput() {
  if (!slugTouched.value) form.slug = slugify(form.title)
}

/* ---------- description helpers ---------- */
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
const hasHtml = (s) => /<\/?(p|br|strong|b|em|i|u|h[1-6]|ul|ol|li|blockquote|code|pre|hr|a|div|span)\b/i.test(s)
const descriptionPreview = computed(() => {
  const d = form.description.trim()
  if (!d) return '<p class="ed-muted">Rien à afficher pour l\'instant.</p>'
  if (hasHtml(d)) {
    // Light client-side cleaning for the preview only (the server sanitises for real).
    return d.replace(/<(script|style|iframe)[\s\S]*?<\/\1>/gi, '').replace(/\son\w+="[^"]*"/gi, '')
  }
  return d.split(/\n\s*\n/).map((p) => `<p>${escapeHtml(p.trim()).replace(/\n/g, '<br>')}</p>`).join('')
})

function replaceSelection(transform) {
  const el = descEl.value
  const { selectionStart: start, selectionEnd: end, value } = el
  const selected = value.slice(start, end)
  const out = transform(selected)
  form.description = value.slice(0, start) + out + value.slice(end)
  requestAnimationFrame(() => {
    el.focus()
    el.setSelectionRange(start, start + out.length)
  })
}
const wrapInline = (tag) => replaceSelection((s) => `<${tag}>${s || 'texte'}</${tag}>`)
const wrapBlock = (tag) => replaceSelection((s) => `<${tag}>${s || (tag === 'h3' ? 'Intertitre' : 'Paragraphe')}</${tag}>`)
const makeList = () => replaceSelection((s) => {
  const lines = (s || 'Élément 1\nÉlément 2').split('\n').map((l) => l.replace(/^[-*•]\s*/, '').trim()).filter(Boolean)
  return `<ul>\n${lines.map((l) => `  <li>${l}</li>`).join('\n')}\n</ul>`
})
function makeLink() {
  const url = window.prompt('Adresse du lien (https://…)', 'https://')
  if (!url || url === 'https://') return
  if (!/^(https?:\/\/|\/|mailto:)/i.test(url)) { toast('Lien invalide.', 'error'); return }
  replaceSelection((s) => `<a href="${url.replace(/"/g, '&quot;')}">${s || url}</a>`)
}

/* ---------- save / close ---------- */
async function save(stay) {
  error.value = ''
  if (!form.title.trim()) {
    error.value = 'Le titre est obligatoire.'
    document.getElementById('f-title')?.focus()
    return
  }
  if (!form.slug) form.slug = slugify(form.title)
  busy.value = true
  try {
    const saved = await api.save({ ...form })
    Object.assign(form, toForm(saved))
    snapshot = JSON.stringify(form)
    toast(isNew.value ? 'Projet créé.' : 'Modifications enregistrées.')
    emit('saved', saved, { stay })
  } catch (err) {
    error.value = err.message
    toast(err.message, 'error', 6000)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    busy.value = false
  }
}

function close() {
  if (dirty.value && !window.confirm('Quitter sans enregistrer les modifications ?')) return
  snapshot = JSON.stringify(form) // already confirmed
  emit('close')
}

function onKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
    e.preventDefault()
    if (!busy.value && !uploading.value) save(true)
  }
}
function onBeforeUnload(e) {
  if (dirty.value) { e.preventDefault(); e.returnValue = '' }
}

onBeforeRouteLeave(() => {
  if (dirty.value && !window.confirm('Quitter sans enregistrer les modifications ?')) return false
  return true
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('beforeunload', onBeforeUnload)
  if (isNew.value) document.getElementById('f-title')?.focus()
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('beforeunload', onBeforeUnload)
})
</script>

<style scoped>
.ed { display: grid; gap: 1.25rem; }
.ed-head { display: grid; gap: 0.4rem; justify-items: start; }
.ed-title { font-size: clamp(1.6rem, 3.5vw, 2.3rem); margin: 0.25rem 0 0; letter-spacing: -0.02em; }
.ed-sub { margin: 0; color: var(--a-soft); font-size: 0.9rem; max-width: 60ch; }
.ed-error { margin: 0; padding: 0.85rem 1rem; border-radius: 10px; background: rgba(255, 107, 107, 0.12); border: 1px solid rgba(255, 107, 107, 0.35); color: #ffc2c2; }

.ed-card {
  margin: 0; min-width: 0;
  padding: 1.25rem clamp(1rem, 2.5vw, 1.75rem) 1.5rem;
  border-radius: 14px; border: 1px solid var(--a-line); background: var(--a-panel);
  display: grid; gap: 1.1rem;
}
.ed-card legend {
  float: left; width: 100%; padding: 0; margin-bottom: 0.25rem;
  font-weight: 800; font-size: 1.05rem;
}
.ed-card legend span {
  display: inline-grid; place-items: center; width: 1.6rem; height: 1.6rem; margin-right: 0.5rem;
  border-radius: 50%; background: rgba(137, 126, 255, 0.18); color: var(--a-accent); font-size: 0.8rem;
}
.ed-card legend small { font-weight: 400; color: var(--a-soft); font-size: 0.85rem; }
.ed-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem 1.25rem; }
.ed-span-2 { grid-column: 1 / -1; }
.ed-field { min-width: 0; }
.ed-input-lg { font-size: 1.15rem; font-weight: 700; padding: 0.8rem 0.9rem; }

.ed-prefix { display: flex; align-items: stretch; }
.ed-prefix span {
  display: grid; place-items: center; padding: 0 0.7rem; border: 1px solid var(--a-line); border-right: 0;
  border-radius: 8px 0 0 8px; background: var(--a-panel-2); color: var(--a-soft);
  font: 0.85rem ui-monospace, SFMono-Regular, Menlo, monospace;
}
.ed-prefix .adm-input { border-radius: 0 8px 8px 0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

.ed-chips { display: flex; flex-wrap: wrap; gap: 0.35rem; list-style: none; padding: 0; margin: 0.6rem 0 0; }
.ed-chips li { padding: 0.25rem 0.65rem; border-radius: 999px; border: 1px solid var(--a-line); font-size: 0.8rem; }

.ed-tabs { display: inline-flex; gap: 0.25rem; padding: 0.25rem; border-radius: 10px; background: var(--a-bg); border: 1px solid var(--a-line); justify-self: start; }
.ed-tabs button { padding: 0.4rem 0.9rem; border: 0; border-radius: 7px; background: transparent; color: var(--a-soft); font: 700 0.85rem var(--font-body), sans-serif; cursor: pointer; }
.ed-tabs button.active { background: var(--a-panel-2); color: var(--a-text); }

.ed-toolbar { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.5rem; }
.ed-toolbar button {
  min-width: 2.2rem; height: 2.1rem; padding: 0 0.6rem; border-radius: 7px;
  border: 1px solid var(--a-line); background: var(--a-panel-2); color: var(--a-text);
  font: 600 0.85rem var(--font-body), sans-serif; cursor: pointer;
}
.ed-toolbar button:hover { border-color: var(--a-accent); }
.ed-desc { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.88rem; line-height: 1.6; min-height: 16rem; }

.ed-preview {
  padding: 1.25rem 1.5rem; border-radius: 10px; background: var(--color-bg, #131413); border: 1px solid var(--a-line);
  max-width: 72ch; color: #d4d4d4; font-size: 1.02rem; line-height: 1.75;
}
.ed-preview :deep(p) { margin: 0 0 1em; }
.ed-preview :deep(h2), .ed-preview :deep(h3), .ed-preview :deep(h4) { font-family: var(--font-display), sans-serif; font-weight: 400; color: #fff; margin: 1.4em 0 0.5em; }
.ed-preview :deep(strong), .ed-preview :deep(b) { color: #fff; }
.ed-preview :deep(ul) { padding-left: 1.2em; }
.ed-preview :deep(a) { color: var(--a-accent); }
.ed-preview :deep(.ed-muted) { color: var(--a-soft); }

.ed-switch { display: flex; align-items: center; gap: 0.9rem; cursor: pointer; }
.ed-switch input { position: absolute; opacity: 0; pointer-events: none; }
.ed-switch-ui { position: relative; flex: 0 0 auto; width: 3rem; height: 1.7rem; border-radius: 999px; background: var(--a-panel-2); border: 1px solid var(--a-line); transition: background-color 0.25s ease; }
.ed-switch-ui::after { content: ''; position: absolute; top: 0.2rem; left: 0.2rem; width: 1.2rem; height: 1.2rem; border-radius: 50%; background: var(--a-soft); transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.25s ease; }
.ed-switch input:checked + .ed-switch-ui { background: rgba(74, 222, 128, 0.25); border-color: rgba(74, 222, 128, 0.5); }
.ed-switch input:checked + .ed-switch-ui::after { transform: translateX(1.3rem); background: var(--a-ok); }
.ed-switch input:focus-visible + .ed-switch-ui { outline: 2px solid var(--a-accent); outline-offset: 2px; }
.ed-switch b { display: block; }
.ed-switch small { color: var(--a-soft); }

.ed-bar {
  position: sticky; bottom: 0; z-index: 30;
  display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 0.5rem;
  margin: 0.5rem calc(clamp(1rem, 3vw, 2rem) * -1) 0; padding: 0.9rem clamp(1rem, 3vw, 2rem);
  background: rgba(15, 16, 15, 0.92); backdrop-filter: blur(12px); border-top: 1px solid var(--a-line);
}
.ed-bar-state { margin-right: auto; font-size: 0.85rem; color: var(--a-soft); }
.ed-bar-state.dirty { color: var(--a-warn); }
.ed-bar-state.dirty::before { content: '● '; }

@media (max-width: 700px) {
  .ed-grid { grid-template-columns: 1fr; }
  .ed-bar-state { width: 100%; }
}
</style>
