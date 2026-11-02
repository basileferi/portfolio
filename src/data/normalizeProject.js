/**
 * One shape for every project, whatever its source (PHP API or static fallback).
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

export function normalizeProject(p = {}) {
  const preview = p.preview || p.image || (Array.isArray(p.media) ? p.media[0] : '') || ''
  return {
    id: p.id ?? null,
    title: p.title || 'Sans titre',
    slug: p.slug || '',
    subtitle: p.subtitle || '',
    category: p.category || '',
    year: p.year ? String(p.year) : '',
    context: p.context || '',
    role: p.role || '',
    preview,
    image: p.image || preview,
    media: toList(p.media, ','),
    description: p.description || '',
    highlights: toList(p.highlights, /\r?\n/),
    tech_stack: p.tech_stack || '',
    stack: toList(p.tech_stack, ','),
    link: p.link || '',
    repo: p.repo || '',
    video: p.video || '',
  }
}
