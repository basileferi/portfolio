/**
 * Resizes / re-encodes images in the browser before upload:
 * faster pages for visitors and no "file too large" errors from the host.
 * GIF (animation) and AVIF are sent untouched.
 */
const MAX_SIDE = 2400
const TARGET_BYTES = 1.8 * 1024 * 1024

function toBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

export async function compressImage(file) {
  if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) return file
  if (file.size < 350 * 1024) return file

  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()

  let best = null
  for (const quality of [0.9, 0.82, 0.74, 0.65]) {
    let blob = await toBlob(canvas, 'image/webp', quality)
    // Older Safari silently falls back to PNG: use JPEG instead.
    if (!blob || blob.type !== 'image/webp') blob = await toBlob(canvas, 'image/jpeg', quality)
    if (!blob) break
    best = blob
    if (blob.size <= TARGET_BYTES) break
  }

  if (!best || (scale === 1 && best.size >= file.size)) return file
  const ext = best.type === 'image/webp' ? 'webp' : 'jpg'
  const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext
  return new File([best], name, { type: best.type, lastModified: Date.now() })
}
