import { spawn, execFileSync } from 'child_process'
import { chmodSync, existsSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import { fileURLToPath } from 'url'
import { config as loadEnv } from 'dotenv'

const root = path.dirname(fileURLToPath(import.meta.url))
loadEnv({ path: path.join(root, '.env') })

const app = path.join(root, 'app')
const repo = process.env.UPDATE_REPO || 'MrDarkNova/nova-md'
const branch = process.env.UPDATE_BRANCH || 'main'

function authEnv() {
  const raw = process.env.GITHUB_DEPLOY_KEY || ''
  if (!raw) return process.env
  const pem = raw.includes('BEGIN') ? raw.replace(/\\n/g, '\n') : Buffer.from(raw, 'base64').toString('utf8')
  const file = path.join(tmpdir(), 'nova-deploy-key')
  writeFileSync(file, pem.endsWith('\n') ? pem : pem + '\n', { mode: 0o600 })
  chmodSync(file, 0o600)
  return { ...process.env, GIT_SSH_COMMAND: `ssh -i ${file} -o StrictHostKeyChecking=no -o IdentitiesOnly=yes` }
}

function remote() {
  if (process.env.GITHUB_DEPLOY_KEY) return `git@github.com:${repo}.git`
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ''
  if (token) return `https://x-access-token:${token}@github.com/${repo}.git`
  return `https://github.com/${repo}.git`
}

if (!existsSync(path.join(app, 'src', 'index.js'))) {
  if (!process.env.GITHUB_DEPLOY_KEY && !process.env.GITHUB_TOKEN && !process.env.GH_TOKEN) {
    console.error('Set GITHUB_DEPLOY_KEY in .env. This public repo cannot read the private bot without it.')
    process.exit(1)
  }
  execFileSync('git', ['clone', '--depth', '1', '-b', branch, remote(), app], { stdio: 'inherit', env: authEnv() })
}

const child = spawn(process.execPath, ['src/index.js'], {
  cwd: app,
  stdio: 'inherit',
  env: process.env,
})
child.on('exit', (code) => process.exit(code ?? 0))
