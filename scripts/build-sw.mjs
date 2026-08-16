/**
 * Post-build step: inject the real asset list into dist/sw.js.
 *
 * Vite hashes file names, so the precache list cannot be written by hand. This
 * walks dist/, writes every file into the service worker as a relative URL, and
 * derives the cache version from a hash of that list — so the version only
 * changes when the output actually changes.
 */

import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const dist = resolve(process.cwd(), 'dist')
const swPath = join(dist, 'sw.js')

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) out.push(...walk(full))
    else out.push(full)
  }
  return out
}

const files = walk(dist)
  .map((f) => relative(dist, f).split('\\').join('/'))
  .filter((f) => f !== 'sw.js')
  .sort()

const urls = files.map((f) => `./${f}`)
const version = createHash('sha256').update(urls.join('\n')).digest('hex').slice(0, 12)

const source = readFileSync(swPath, 'utf8')
const injected = source
  .replace("'__BUILD_VERSION__'", JSON.stringify(version))
  .replace('__PRECACHE_URLS__', JSON.stringify(urls, null, 2))

if (injected === source) {
  console.error('build-sw: placeholders not found in dist/sw.js — precache was NOT injected.')
  process.exit(1)
}

writeFileSync(swPath, injected)
console.log(`build-sw: cached ${urls.length} files, version ${version}`)
