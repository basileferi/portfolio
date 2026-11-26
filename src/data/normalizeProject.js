/**
 * One shape for every project (public API or admin preview), in the requested language.
 * French columns are the reference; `<field>_en` columns hold the English version and
 * fall back to French when left empty in the back office.
 */
const toList = (value, separator) => {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean)
  if (typeof value !== 'string') return []
  return value.split(separator).map((v) => v.trim()).filter(Boolean)
}

export function isExternalUrl(url) {
  return /^https?:\/\//i.test(url || '')
}

/** Returns { kind: 'iframe' | 'video', src } or null. */
export function videoEmbed(url) {
  if (!url) return null
  if (/youtube(-nocookie)?\.com\/embed\/|player\.vimeo\.com\/video\//i.test(url)) return { kind: 'iframe', src: url }
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/)|youtu\.be\/)([\w-]{6,})/i)
  if (yt) return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${yt[1]}` }
  const vimeo = url.match(/vimeo\.com\/(\d+)/i)
  if (vimeo) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vimeo[1]}` }
  return { kind: 'video', src: url }
}

const hasValue = (v) => (Array.isArray(v) ? v.length > 0 : typeof v === 'string' && v.trim() !== '')

/** English value when there is one, French otherwise. */
function localized(p, field, lang) {
  if (lang === 'en' && hasValue(p[`${field}_en`])) return p[`${field}_en`]
  return p[field]
}

export function normalizeProject(p = {}, lang = 'fr') {
  const preview = p.preview || p.image || (Array.isArray(p.media) ? p.media[0] : '') || ''
  const pick = (field) => localized(p, field, lang)
  return {
    id: p.id ?? null,
    title: pick('title') || (lang === 'en' ? 'Untitled' : 'Sans titre'),
    slug: p.slug || '',
    subtitle: pick('subtitle') || '',
    category: pick('category') || '',
    year: p.year ? String(p.year) : '',
    context: pick('context') || '',
    role: pick('role') || '',
    preview,
    image: p.image || preview,
    media: toList(p.media, ','),
    description: pick('description') || '',
    highlights: toList(pick('highlights'), /\r?\n/),
    tech_stack: p.tech_stack || '',
    stack: toList(p.tech_stack, ','),
    link: p.link || '',
    repo: p.repo || '',
    video: p.video || '',
  }
}
