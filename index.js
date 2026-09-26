import { spawn, execFileSync } from 'child_process'
import { copyFileSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config as loadEnv } from 'dotenv'

const root = path.dirname(fileURLToPath(import.meta.url))
const envFile = path.join(root, '.env')
const example = path.join(root, '.env.example')
if (!existsSync(envFile) && existsSync(example)) copyFileSync(example, envFile)
loadEnv({ path: envFile })

try {
  for (const name of readdirSync('/tmp')) {
    if (name.startsWith('nova-keep-')) rmSync(path.join('/tmp', name), { recursive: true, force: true })
  }
} catch {}

const app = path.join(root, 'app')
const repo = process.env.UPDATE_REPO || 'MrDarkNova/nova-md'
const branch = process.env.UPDATE_BRANCH || 'main'
const wrap = `const { Client } = require('ssh2')
const raw = process.env.GITHUB_DEPLOY_KEY || ''
const pem = raw.includes('BEGIN') ? raw.replace(/\\\\n/g, '\\n') : Buffer.from(raw, 'base64').toString('utf8')
const args = process.argv.slice(2)
const at = args.findIndex((a) => a.includes('github.com') || a.includes('@'))
const cmd = args.slice(at + 1).join(' ')
const conn = new Client()
conn.on('ready', () => {
  conn.exec(cmd, (err, stream) => {
    if (err) { console.error(err.message); process.exit(1) }
    process.stdin.pipe(stream)
    stream.pipe(process.stdout)
    stream.stderr.pipe(process.stderr)
    stream.on('close', (code) => { conn.end(); process.exit(code || 0) })
  })
}).on('error', (err) => { console.error(err.message); process.exit(1) }).connect({
  host: 'github.com', port: 22, username: 'git', privateKey: pem, readyTimeout: 20000,
})
`

function remote() {
  if (process.env.GITHUB_DEPLOY_KEY) return `git@github.com:${repo}.git`
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || ''
  if (token) return `https://x-access-token:${token}@github.com/${repo}.git`
  return `https://github.com/${repo}.git`
}

function authEnv() {
  if (!process.env.GITHUB_DEPLOY_KEY) return process.env
  const file = path.join(root, '.git-ssh.cjs')
  writeFileSync(file, wrap)
  return { ...process.env, GIT_SSH_COMMAND: `node ${file}` }
}

if (!existsSync(path.join(app, 'src', 'index.js'))) {
  if (!process.env.GITHUB_DEPLOY_KEY && !process.env.GITHUB_TOKEN && !process.env.GH_TOKEN) {
    console.error('Set GITHUB_DEPLOY_KEY in .env')
    process.exit(1)
  }
  rmSync(app, { recursive: true, force: true })
  execFileSync('git', ['clone', '--depth', '1', '-b', branch, remote(), app], { stdio: 'inherit', env: authEnv() })
} else {
  try {
    console.log('Checking for bot updates...')
    execFileSync('git', ['fetch', '--depth', '1', 'origin', branch], { cwd: app, stdio: 'inherit', env: authEnv() })
    execFileSync('git', ['reset', '--hard', 'FETCH_HEAD'], { cwd: app, stdio: 'inherit', env: authEnv() })
    console.log('Bot code is up to date.')
  } catch (err) {
    console.error('Could not update. Starting the copy already on the panel.')
    console.error(err?.message || err)
  }
}

let current = null
let shuttingDown = false

function shutdown() {
  if (shuttingDown) return
  shuttingDown = true
  if (current && !current.killed) current.kill('SIGTERM')
  setTimeout(() => process.exit(0), 800)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

function childEnv() {
  const env = { ...process.env }
  if (!existsSync(envFile)) return env
  const text = readFileSync(envFile, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    env[key] = value
  }
  return env
}

function boot() {
  current = spawn(process.execPath, ['src/index.js'], { cwd: app, stdio: 'inherit', env: childEnv() })
  current.on('exit', (code) => {
    if (shuttingDown) {
      process.exit(0)
      return
    }
    console.log(`Bot stopped (${code ?? 0}). Starting it again. The panel stays up.`)
    setTimeout(boot, 800)
  })
}

boot()
