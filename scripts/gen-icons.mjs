/**
 * Generates the PWA icons — no image dependencies, no binary assets in the repo.
 *
 * Shapes are drawn as signed distance fields and rasterised with antialiasing,
 * then written out as PNGs with a hand-rolled encoder on top of node:zlib.
 * Run `npm run icons` after changing anything here.
 */

import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

// ── PNG encoder ─────────────────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePNG(width, height, rgba) {
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // colour type: RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ── Signed distance fields (normalised 0..1 space) ──────────────────────────

const len = (x, y) => Math.hypot(x, y)

function sdRoundedBox(px, py, cx, cy, hw, hh, r) {
  const qx = Math.abs(px - cx) - hw + r
  const qy = Math.abs(py - cy) - hh + r
  return len(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r
}

function sdCapsule(px, py, ax, ay, bx, by, r) {
  const pax = px - ax
  const pay = py - ay
  const bax = bx - ax
  const bay = by - ay
  const h = Math.min(1, Math.max(0, (pax * bax + pay * bay) / (bax * bax + bay * bay)))
  return len(pax - bax * h, pay - bay * h) - r
}

function sdEllipse(px, py, cx, cy, rx, ry) {
  // Good enough for filling: scale into circle space and back.
  const dx = (px - cx) / rx
  const dy = (py - cy) / ry
  return (len(dx, dy) - 1) * Math.min(rx, ry)
}

/** Fork on the left, spoon on the right. Returns the glyph's signed distance. */
function glyph(x, y) {
  const forkX = 0.355
  const fork = Math.min(
    // handle
    sdCapsule(x, y, forkX, 0.8, forkX, 0.52, 0.036),
    // neck
    sdCapsule(x, y, forkX, 0.56, forkX, 0.44, 0.058),
    // three tines
    sdCapsule(x, y, forkX - 0.072, 0.45, forkX - 0.072, 0.24, 0.028),
    sdCapsule(x, y, forkX, 0.45, forkX, 0.22, 0.028),
    sdCapsule(x, y, forkX + 0.072, 0.45, forkX + 0.072, 0.24, 0.028),
  )

  const spoonX = 0.645
  const spoon = Math.min(
    sdCapsule(x, y, spoonX, 0.8, spoonX, 0.44, 0.036),
    sdEllipse(x, y, spoonX, 0.325, 0.098, 0.125),
  )

  return Math.min(fork, spoon)
}

// ── Rasteriser ──────────────────────────────────────────────────────────────

const INK = [0xf3, 0xf0, 0xe6] // warm cream
const BG = [0x17, 0x49, 0x3a] // deep green

function render(size, { maskable = false, cornerRadius = 0.22, scale = 1 } = {}) {
  const buf = Buffer.alloc(size * size * 4)
  const px = 1 / size // one pixel in normalised units, for antialiasing

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = (x + 0.5) / size
      const v = (y + 0.5) / size

      // Background: full bleed for maskable, rounded square otherwise.
      const bgD = maskable
        ? -1
        : sdRoundedBox(u, v, 0.5, 0.5, 0.5, 0.5, cornerRadius)
      const bgA = Math.min(1, Math.max(0, 0.5 - bgD / px))

      // Glyph, optionally shrunk toward the centre to sit inside the safe zone.
      const gx = (u - 0.5) / scale + 0.5
      const gy = (v - 0.5) / scale + 0.5
      const gD = glyph(gx, gy) * scale
      const gA = Math.min(1, Math.max(0, 0.5 - gD / px)) * bgA

      const i = (y * size + x) * 4
      buf[i] = Math.round(BG[0] * (1 - gA) + INK[0] * gA)
      buf[i + 1] = Math.round(BG[1] * (1 - gA) + INK[1] * gA)
      buf[i + 2] = Math.round(BG[2] * (1 - gA) + INK[2] * gA)
      buf[i + 3] = Math.round(bgA * 255)
    }
  }
  return encodePNG(size, size, buf)
}

// ── Output ──────────────────────────────────────────────────────────────────

const outDir = resolve(process.cwd(), 'public')
mkdirSync(outDir, { recursive: true })

const targets = [
  ['favicon-32.png', render(32, { cornerRadius: 0.26 })],
  ['icon-192.png', render(192)],
  ['icon-512.png', render(512)],
  // Maskable icons get cropped to a circle on some launchers: keep the glyph
  // inside the middle 80% and let the background bleed to the edges.
  ['icon-maskable-512.png', render(512, { maskable: true, scale: 0.68 })],
  // iOS applies its own rounding and does not support transparency.
  ['apple-touch-icon.png', render(180, { maskable: true, scale: 0.82 })],
]

for (const [name, data] of targets) {
  writeFileSync(join(outDir, name), data)
  console.log(`icons: ${name} (${(data.length / 1024).toFixed(1)} kB)`)
}
