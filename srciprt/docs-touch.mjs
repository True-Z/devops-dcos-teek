import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

function nowString() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function usage() {
  console.log('Usage:')
  console.log('  pnpm docs:touch')
  console.log('  pnpm docs:touch docs/xx/yy.md')
  console.log('  pnpm docs:touch --changed')
  console.log('  pnpm docs:touch --since HEAD~1')
  console.log('  pnpm docs:touch --since HEAD~3..HEAD')
  console.log('  pnpm docs:touch docs/a.md docs/b.md --changed')
}

function getChangedDocFiles() {
  const files = new Set()
  const commands = [
    'git -c core.quotepath=off diff --name-only -- docs',
    'git -c core.quotepath=off diff --name-only --cached -- docs',
    'git -c core.quotepath=off ls-files --others --exclude-standard -- docs',
  ]

  for (const command of commands) {
    const out = execSync(command, { encoding: 'utf8' }).trim()
    if (!out) continue
    for (const line of out.split(/\r?\n/)) {
      if (line && line.endsWith('.md')) files.add(line)
    }
  }

  return [...files]
}

function getDocFilesSince(revision) {
  const files = new Set()
  const range = revision.includes('..') ? revision : `${revision}..HEAD`
  const command = `git -c core.quotepath=off diff --name-only ${range} -- docs`
  const out = execSync(command, { encoding: 'utf8' }).trim()
  if (!out) return []

  for (const line of out.split(/\r?\n/)) {
    if (line && line.endsWith('.md')) files.add(line)
  }

  return [...files]
}

function normalizeTargets(rawTargets) {
  return rawTargets.map((file) => file.replace(/\\/g, '/')).map((file) => (path.isAbsolute(file) ? path.relative(process.cwd(), file).replace(/\\/g, '/') : file))
}

function isValidDocsMarkdown(file) {
  return file.startsWith('docs/') && file.endsWith('.md')
}

function updateDateInFile(filePath, dateText) {
  if (!fs.existsSync(filePath)) {
    return { ok: false, reason: 'not_found' }
  }

  const raw = fs.readFileSync(filePath, 'utf8')
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!fmMatch) {
    return { ok: false, reason: 'no_frontmatter' }
  }

  const fmRaw = fmMatch[1]
  let newFmRaw

  if (/^date:\s*.*$/m.test(fmRaw)) {
    newFmRaw = fmRaw.replace(/^date:\s*.*$/m, `date: ${dateText}`)
  } else if (/^title:\s*.*$/m.test(fmRaw)) {
    newFmRaw = fmRaw.replace(/^title:\s*.*$/m, (line) => `${line}\ndate: ${dateText}`)
  } else {
    newFmRaw = `date: ${dateText}\n${fmRaw}`
  }

  const replacement = `---\n${newFmRaw}\n---\n`
  const updated = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, replacement)

  if (updated === raw) {
    return { ok: true, changed: false }
  }

  fs.writeFileSync(filePath, updated, 'utf8')
  return { ok: true, changed: true }
}

function main() {
  const args = process.argv.slice(2)
  if (args.includes('--help') || args.includes('-h')) {
    usage()
    process.exit(0)
  }

  const sinceEqArg = args.find((arg) => arg.startsWith('--since='))
  const sinceArgIndex = args.findIndex((arg) => arg === '--since')
  const sinceValue = sinceEqArg ? sinceEqArg.slice('--since='.length) : sinceArgIndex >= 0 ? args[sinceArgIndex + 1] : ''

  if (sinceArgIndex >= 0 && !sinceValue) {
    console.error('Missing revision after --since')
    usage()
    process.exit(1)
  }

  const changedMode = args.includes('--changed') || args.length === 0
  const sinceMode = Boolean(sinceValue)
  const directTargets = args.filter((arg) => !arg.startsWith('--'))
  const normalizedDirectTargets = sinceArgIndex >= 0 ? directTargets.filter((arg) => arg !== sinceValue) : directTargets

  const allTargets = new Set(normalizeTargets(normalizedDirectTargets))
  if (changedMode) {
    for (const file of getChangedDocFiles()) allTargets.add(file)
  }

  if (sinceMode) {
    try {
      for (const file of getDocFilesSince(sinceValue)) allTargets.add(file)
    } catch (error) {
      console.error(`Failed to resolve --since ${sinceValue}`)
      console.error(String(error.message || error))
      process.exit(1)
    }
  }

  if (!allTargets.size) {
    console.log('No target files found, nothing to update.')
    process.exit(0)
  }

  const files = [...allTargets].filter(isValidDocsMarkdown)
  const ignored = [...allTargets].filter((f) => !isValidDocsMarkdown(f))

  if (!files.length) {
    console.error('No valid docs markdown files to update.')
    if (ignored.length) console.error(`Ignored: ${ignored.join(', ')}`)
    process.exit(1)
  }

  const dateText = nowString()
  let changed = 0
  let skipped = 0

  for (const rel of files) {
    const abs = path.resolve(process.cwd(), rel)
    const result = updateDateInFile(abs, dateText)

    if (!result.ok) {
      skipped += 1
      console.log(`skip  ${rel} (${result.reason})`)
      continue
    }

    if (result.changed) {
      changed += 1
      console.log(`touch ${rel} -> ${dateText}`)
    } else {
      console.log(`keep  ${rel}`)
    }
  }

  if (ignored.length) {
    console.log(`ignored non-docs files: ${ignored.join(', ')}`)
  }

  console.log(`done: changed=${changed}, skipped=${skipped}, total=${files.length}`)
}

main()
