import { spawn, execFileSync } from 'child_process'
import { existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config as loadEnv } from 'dotenv'

const root = path.dirname(fileURLToPath(import.meta.url))
loadEnv({ path: path.join(root, '.env') })

const app = path.join(root, 'app')
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ''
const repo = process.env.UPDATE_REPO || 'MrDarkNova/nova-md'
const branch = process.env.UPDATE_BRANCH || 'main'

function remote() {
  if (!token) return `https://github.com/${repo}.git`
  return `https://x-access-token:${token}@github.com/${repo}.git`
}

if (!existsSync(path.join(app, 'src', 'index.js'))) {
  if (!token) {
    console.error('Set GITHUB_TOKEN in .env. This public repo cannot read the private bot without it.')
    process.exit(1)
  }
  execFileSync('git', ['clone', '--depth', '1', '-b', branch, remote(), app], { stdio: 'inherit' })
}

const child = spawn(process.execPath, ['src/index.js'], {
  cwd: app,
  stdio: 'inherit',
  env: process.env,
})
child.on('exit', (code) => process.exit(code ?? 0))
