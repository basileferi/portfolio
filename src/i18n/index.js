/**
 * Tiny i18n layer: English by default, French on demand.
 *
 * - `t('a.b', { n: 2 })` returns a string ({n} placeholders are replaced,
 *   function entries receive the params), `tm('a.b')` returns raw arrays/objects.
 * - The choice is remembered in localStorage; `?lang=fr` / `?lang=en` in a link forces it.
 * - Callable outside components (router, Three.js) because `locale` is a module-level ref.
 */
import { ref, nextTick } from 'vue'
import en from './en.js'
import fr from './fr.js'
import { enterCurtain, leaveCurtain } from '@/composables/usePageTransition'

export const LOCALES = ['en', 'fr']
const DEFAULT_LOCALE = 'en'
const STORAGE_KEY = 'kosmo:lang'
const messages = { en, fr }

function initialLocale() {
  try {
    const url = new URL(window.location.href)
    const fromUrl = url.searchParams.get('lang')
    if (fromUrl !== null) {
      // Read once, then drop it from the address bar so a later toggle + reload is respected.
      url.searchParams.delete('lang')
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
    }
    if (LOCALES.includes(fromUrl)) {
      localStorage.setItem(STORAGE_KEY, fromUrl)
      return fromUrl
    }
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LOCALES.includes(saved)) return saved
  } catch { /* private mode */ }
  return DEFAULT_LOCALE
}

export const locale = ref(initialLocale())

function lookup(lang, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), messages[lang])
}

/** Raw message (string, array, object or function), with English as fallback. */
export function tm(key) {
  const value = lookup(locale.value, key)
  return value === undefined ? lookup(DEFAULT_LOCALE, key) : value
}

export function t(key, params = {}) {
  const value = tm(key)
  if (typeof value === 'function') return value(params)
  if (typeof value !== 'string') return key
  return value.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match))
}

function applyDocumentLocale() {
  document.documentElement.lang = locale.value
  const description = document.querySelector('meta[name="description"]')
  if (description) description.setAttribute('content', t('meta.description'))
}

export function setLocale(next) {
  if (!LOCALES.includes(next)) return
  locale.value = next
  try { localStorage.setItem(STORAGE_KEY, next) } catch { /* private mode */ }
  applyDocumentLocale()
}

/**
 * Switches language behind the page curtain: the curtain closes, the page is
 * re-rendered in the new language (App.vue keys the view on the locale), then opens.
 */
let switching = false

export function switchLocale(next) {
  if (switching || next === locale.value || !LOCALES.includes(next)) return
  switching = true
  enterCurtain(async () => {
    setLocale(next)
    await nextTick()
    setTimeout(() => {
      leaveCurtain()
      switching = false
    }, 80)
  }, messages[next].lang.curtain)
}

applyDocumentLocale()
