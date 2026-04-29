import { cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'

const distServerDir = path.resolve(process.cwd(), 'dist', 'server')
const distClientDir = path.resolve(process.cwd(), 'dist', 'client')
const apiStartDir = path.resolve(process.cwd(), 'api', '_start')
const publicDir = path.resolve(process.cwd(), 'public')

async function main() {
  // Ensure we don't deploy stale server bundles
  await rm(apiStartDir, { recursive: true, force: true })
  await mkdir(apiStartDir, { recursive: true })

  // Copy the full server bundle (server.js + assets it imports)
  await cp(distServerDir, apiStartDir, { recursive: true })

  // Copy client assets into /public so Vercel can serve them as static files.
  // We remove only the generated assets folder to avoid stale hashed filenames.
  await mkdir(publicDir, { recursive: true })
  await rm(path.resolve(publicDir, 'assets'), { recursive: true, force: true })
  await cp(distClientDir, publicDir, { recursive: true })
}

main().catch((err) => {
  console.error('[vercel-prepare] Failed:', err)
  process.exit(1)
})
