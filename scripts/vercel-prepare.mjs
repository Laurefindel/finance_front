import { cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'

const distServerDir = path.resolve(process.cwd(), 'dist', 'server')
const distClientDir = path.resolve(process.cwd(), 'dist', 'client')
const apiStartDir = path.resolve(process.cwd(), 'api', '_start')
const publicDir = path.resolve(process.cwd(), 'public')

try {
  // Ensure we don't deploy stale server bundles
  await rm(apiStartDir, { recursive: true, force: true })
  await mkdir(apiStartDir, { recursive: true })

  // Copy the full server bundle
  await cp(distServerDir, apiStartDir, { recursive: true })

  // Prepare public assets
  await mkdir(publicDir, { recursive: true })
  await rm(path.resolve(publicDir, 'assets'), { recursive: true, force: true })
  await cp(distClientDir, publicDir, { recursive: true })
} catch (err) {
  console.error('[vercel-prepare] Failed:', err)
  process.exit(1)
}