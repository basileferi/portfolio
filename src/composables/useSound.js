/**
 * Kosmo sound design — every sound is synthesised live with the Web Audio API
 * (no audio files to download). Sounds are subtle UI cues: hover ticks, soft
 * clicks, a filtered-noise "whoosh" for page transitions, glassy chimes on
 * reveals and a very quiet ambient pad on project pages.
 *
 * Browsers only allow audio after a user gesture: the context is created on
 * the first pointer/key interaction. The on/off preference is remembered.
 */
import { ref, watch } from 'vue'

const STORAGE_KEY = 'kosmo:sound'
const MASTER_LEVEL = 0.55

function readPreference() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === null ? true : v === '1'
  } catch {
    return true
  }
}

export const soundEnabled = ref(typeof window !== 'undefined' ? readPreference() : false)

let ctx = null
let master = null
let reverbSend = null
let noiseBuffer = null
const lastPlayed = new Map()

function makeImpulse(seconds, decay) {
  const rate = ctx.sampleRate
  const length = Math.floor(rate * seconds)
  const impulse = ctx.createBuffer(2, length, rate)
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch)
    for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
  }
  return impulse
}

function createContext() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ctx = new AC()

  const compressor = ctx.createDynamicsCompressor()
  compressor.threshold.value = -20
  compressor.ratio.value = 4
  compressor.connect(ctx.destination)

  master = ctx.createGain()
  master.gain.value = soundEnabled.value ? MASTER_LEVEL : 0
  master.connect(compressor)

  const reverb = ctx.createConvolver()
  reverb.buffer = makeImpulse(2.2, 2.8)
  reverbSend = ctx.createGain()
  reverbSend.gain.value = 0.9
  reverbSend.connect(reverb)
  reverb.connect(master)

  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
}

function unlock() {
  if (!ctx) createContext()
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {})
}

if (typeof window !== 'undefined') {
  for (const ev of ['pointerdown', 'keydown', 'touchstart']) {
    window.addEventListener(ev, unlock, { passive: true, capture: true })
  }
}

watch(soundEnabled, (on) => {
  try { localStorage.setItem(STORAGE_KEY, on ? '1' : '0') } catch { /* private mode */ }
  if (master && ctx) {
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(on ? MASTER_LEVEL : 0, ctx.currentTime, 0.08)
  }
  if (!on) stopPad() // keeps padWanted so the pad resumes when sound is re-enabled
})

const ready = () => soundEnabled.value && ctx && ctx.state === 'running' && !document.hidden

/** Prevents machine-gun repeats (e.g. sweeping the mouse across a list). */
function throttle(key, ms) {
  const now = performance.now()
  if (now - (lastPlayed.get(key) || 0) < ms) return false
  lastPlayed.set(key, now)
  return true
}

function connectOut(node, { pan = 0, reverb = 0 }) {
  let out = node
  if (pan && ctx.createStereoPanner) {
    const p = ctx.createStereoPanner()
    p.pan.value = pan
    out.connect(p)
    out = p
  }
  out.connect(master)
  if (reverb > 0) {
    const send = ctx.createGain()
    send.gain.value = reverb
    out.connect(send)
    send.connect(reverbSend)
  }
}

function envelope(param, t, peak, attack, decay) {
  param.setValueAtTime(0.0001, t)
  param.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + attack)
  param.exponentialRampToValueAtTime(0.0001, t + attack + decay)
}

function tone({ type = 'sine', freq, to, at = 0, attack = 0.004, decay = 0.2, gain = 0.1, pan = 0, reverb = 0 }) {
  const t = ctx.currentTime + at
  const osc = ctx.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + attack + decay)
  const g = ctx.createGain()
  envelope(g.gain, t, gain, attack, decay)
  osc.connect(g)
  connectOut(g, { pan, reverb })
  osc.start(t)
  osc.stop(t + attack + decay + 0.05)
}

function noise({ at = 0, attack = 0.01, decay = 0.3, gain = 0.1, filter = 'bandpass', freq = 1000, to, q = 1, pan = 0, reverb = 0 }) {
  const t = ctx.currentTime + at
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer
  const f = ctx.createBiquadFilter()
  f.type = filter
  f.Q.value = q
  f.frequency.setValueAtTime(freq, t)
  if (to) f.frequency.exponentialRampToValueAtTime(to, t + attack + decay)
  const g = ctx.createGain()
  envelope(g.gain, t, gain, attack, decay)
  src.connect(f)
  f.connect(g)
  connectOut(g, { pan, reverb })
  src.start(t, Math.random() * 1.5)
  src.stop(t + attack + decay + 0.05)
}

/** Maps a screen x position to a stereo pan for a bit of spatial feel. */
const panFromEvent = (e) => (e && typeof e.clientX === 'number' ? ((e.clientX / window.innerWidth) * 2 - 1) * 0.6 : 0)

export const sfx = {
  /** Tiny glassy tick for hovering interactive items. */
  hover(e) {
    if (!ready() || !throttle('hover', 70)) return
    const pan = panFromEvent(e)
    tone({ freq: 2400 + Math.random() * 300, to: 1800, decay: 0.05, gain: 0.03, pan })
    noise({ filter: 'highpass', freq: 6500, decay: 0.025, gain: 0.018, pan })
  },

  /** Softer tick for filters / toggles. */
  tick(e) {
    if (!ready() || !throttle('tick', 50)) return
    tone({ type: 'triangle', freq: 1400, to: 1100, decay: 0.06, gain: 0.04, pan: panFromEvent(e) })
  },

  /** Rounded "thock" on click. */
  click(e) {
    if (!ready() || !throttle('click', 60)) return
    const pan = panFromEvent(e)
    tone({ freq: 520, to: 110, decay: 0.16, gain: 0.16, pan })
    tone({ type: 'triangle', freq: 1500, decay: 0.035, gain: 0.035, pan })
  },

  /** Filtered noise sweep + sub drop: page transition (curtain closing). */
  whoosh() {
    if (!ready() || !throttle('whoosh', 300)) return
    noise({ filter: 'bandpass', freq: 260, to: 3200, attack: 0.28, decay: 0.42, gain: 0.2, q: 0.9, reverb: 0.25 })
    tone({ freq: 90, to: 42, attack: 0.18, decay: 0.55, gain: 0.12 })
  },

  /** Glassy two-note chime: content revealed (curtain opening). */
  reveal() {
    if (!ready() || !throttle('reveal', 300)) return
    tone({ freq: 880, decay: 1.1, gain: 0.045, reverb: 0.5, pan: -0.25 })
    tone({ freq: 1318.5, at: 0.08, decay: 1.2, gain: 0.032, reverb: 0.5, pan: 0.25 })
    noise({ filter: 'highpass', freq: 5000, to: 9000, attack: 0.02, decay: 0.4, gain: 0.015, reverb: 0.4 })
  },

  /** Lightbox open. */
  open() {
    if (!ready() || !throttle('open', 120)) return
    tone({ type: 'triangle', freq: 660, decay: 0.28, gain: 0.06, reverb: 0.3 })
    tone({ freq: 990, at: 0.05, decay: 0.32, gain: 0.04, reverb: 0.3 })
  },

  /** Lightbox close. */
  close() {
    if (!ready() || !throttle('close', 120)) return
    tone({ freq: 990, to: 520, decay: 0.2, gain: 0.05, reverb: 0.2 })
  },

  /** Image / project change (swipe). */
  swipe(direction = 1) {
    if (!ready() || !throttle('swipe', 90)) return
    const pan = 0.45 * direction
    noise({ filter: 'bandpass', freq: 1800, to: 500, decay: 0.18, gain: 0.08, q: 1.4, pan })
    tone({ freq: direction > 0 ? 420 : 640, to: direction > 0 ? 640 : 420, decay: 0.12, gain: 0.035, pan })
  },

  success() {
    if (!ready()) return
    tone({ freq: 659.25, decay: 0.3, gain: 0.06, reverb: 0.3 })
    tone({ freq: 987.77, at: 0.09, decay: 0.45, gain: 0.05, reverb: 0.3 })
  },

  error() {
    if (!ready()) return
    tone({ type: 'triangle', freq: 180, to: 140, decay: 0.16, gain: 0.09 })
    tone({ type: 'triangle', freq: 180, to: 130, at: 0.13, decay: 0.2, gain: 0.08 })
  },
}

/** Turns sound on/off with an audible confirmation. */
export function toggleSound() {
  unlock()
  if (soundEnabled.value) {
    if (ctx && ctx.state === 'running') tone({ freq: 783.99, to: 392, decay: 0.25, gain: 0.05 })
    soundEnabled.value = false
  } else {
    soundEnabled.value = true
    // The master gain ramps up; schedule slightly later so the arpeggio is audible.
    setTimeout(() => {
      if (!ready()) return
      ;[523.25, 659.25, 783.99].forEach((f, i) => tone({ freq: f, at: i * 0.06, decay: 0.4, gain: 0.05, reverb: 0.4 }))
    }, 60)
  }
}

/* ------------------------------------------------------------------ */
/* Ambient pad — barely audible "room tone" on project pages           */
/* ------------------------------------------------------------------ */

let pad = null
let padWanted = false

function startPad() {
  if (pad || !ready()) return
  const out = ctx.createGain()
  out.gain.setValueAtTime(0.0001, ctx.currentTime)
  out.gain.exponentialRampToValueAtTime(0.022, ctx.currentTime + 3)
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 520
  lp.Q.value = 0.7
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.07
  lfoGain.gain.value = 220
  lfo.connect(lfoGain)
  lfoGain.connect(lp.frequency)
  const oscs = [110, 164.81, 220.4, 329.2].map((f, i) => {
    const o = ctx.createOscillator()
    o.type = i % 2 ? 'triangle' : 'sine'
    o.frequency.value = f
    o.detune.value = (i - 1.5) * 6
    o.connect(lp)
    o.start()
    return o
  })
  lp.connect(out)
  connectOut(out, { reverb: 0.6 })
  lfo.start()
  pad = { out, oscs, lfo }
}

function stopPad() {
  if (!pad || !ctx) return
  const { out, oscs, lfo } = pad
  pad = null
  const t = ctx.currentTime
  out.gain.cancelScheduledValues(t)
  out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), t)
  out.gain.exponentialRampToValueAtTime(0.0001, t + 1.2)
  ;[...oscs, lfo].forEach((o) => o.stop(t + 1.3))
}

export const ambient = {
  start() {
    padWanted = true
    startPad()
  },
  stop() {
    padWanted = false
    stopPad()
  },
}

// The pad may be requested before the first user gesture: start it as soon as audio unlocks.
if (typeof window !== 'undefined') {
  const retry = () => { if (padWanted) setTimeout(startPad, 50) }
  window.addEventListener('pointerdown', retry, { passive: true })
  window.addEventListener('keydown', retry, { passive: true })
  watch(soundEnabled, (on) => { if (on && padWanted) setTimeout(startPad, 80) })
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopPad()
    else if (padWanted) startPad()
  })
}
