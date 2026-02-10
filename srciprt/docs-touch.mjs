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
  console.log('  pnpm docs:touch docs/xx/yy.md')
  console.log('  pnpm docs:touch --changed')
  console.log('  pnpm docs:touch docs/a.md docs/b.md --changed')
}

function getChangedDocFiles() {
  const files = new Set()
  const commands = ['git diff --name-only -- docs', 'git diff --name-only --cached -- docs', 'git ls-files --others --exclude-standard -- docs']

  for (const command of commands) {
    const out = execSync(command, { encoding: 'utf8' }).trim()
    if (!out) continue
    for (const line of out.split(/\r?\n/)) {
      if (line && line.endsWith('.md')) files.add(line)
    }
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

  const changedMode = args.includes('--changed')
  const directTargets = args.filter((arg) => !arg.startsWith('--'))

  const allTargets = new Set(normalizeTargets(directTargets))
  if (changedMode) {
    for (const file of getChangedDocFiles()) allTargets.add(file)
  }

  if (!allTargets.size) {
    console.error('No target files found.')
    usage()
    process.exit(1)
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
