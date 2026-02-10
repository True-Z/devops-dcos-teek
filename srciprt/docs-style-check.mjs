import fs from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const docsRoot = path.join(repoRoot, 'docs')
const configPath = path.join(repoRoot, '.vitepress', 'config.ts')

const toPosix = (p) => p.split(path.sep).join('/')

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function walkMarkdownFiles(dir, result = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) walkMarkdownFiles(fullPath, result)
    else if (entry.isFile() && fullPath.endsWith('.md')) result.push(fullPath)
  }
  return result
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return null

  const fm = {}
  let currentKey = null

  for (const line of match[1].split(/\r?\n/)) {
    if (/^\s*$/.test(line)) continue

    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (kv) {
      currentKey = kv[1]
      fm[currentKey] = kv[2] ?? ''
      continue
    }

    const item = line.match(/^\s*-\s*(.*)$/)
    if (item && currentKey) {
      if (!Array.isArray(fm[currentKey])) fm[currentKey] = []
      fm[currentKey].push(item[1])
    }
  }

  return fm
}

function scan() {
  const files = walkMarkdownFiles(docsRoot)
  const docs = files.map((filePath) => {
    const content = readFile(filePath)
    return {
      file: toPosix(path.relative(repoRoot, filePath)),
      content,
      frontmatter: parseFrontmatter(content),
    }
  })

  const issues = {
    noFrontmatter: [],
    frontmatterUnsafeAtValue: [],
    duplicatePermalink: [],
    catalogueTitleMismatch: [],
    introMissingKeys: [],
    introTitleNotIntro: [],
    permalinkTrailingSlash: [],
    brokenInternalLinks: [],
    navUncoveredTopDirs: [],
  }

  const permalinkMap = new Map()

  for (const doc of docs) {
    if (!doc.frontmatter) {
      issues.noFrontmatter.push(doc.file)
      continue
    }

    const frontmatterMatch = doc.content.match(/^---\n([\s\S]*?)\n---\n?/)
    if (frontmatterMatch) {
      const lines = frontmatterMatch[1].split(/\r?\n/)
      for (let i = 0; i < lines.length; i += 1) {
        // YAML treats '@' as a reserved indicator in plain scalars.
        // Force quoting to avoid parser errors in frontmatter.
        if (/^\s*-\s*@\S+/.test(lines[i])) {
          const lineNo = i + 2
          issues.frontmatterUnsafeAtValue.push(`${doc.file}:${lineNo} -> ${lines[i].trim()}`)
        }
      }
    }

    const permalink = doc.frontmatter.permalink
    if (typeof permalink === 'string' && permalink) {
      const normalized = permalink.replace(/\/$/, '')
      if (!permalinkMap.has(normalized)) permalinkMap.set(normalized, [])
      permalinkMap.get(normalized).push(doc.file)

      if (/\/$/.test(permalink)) {
        issues.permalinkTrailingSlash.push(`${doc.file} -> ${permalink}`)
      }
    }
  }

  for (const [permalink, matchedFiles] of permalinkMap.entries()) {
    if (matchedFiles.length > 1) {
      issues.duplicatePermalink.push(`${permalink} => ${matchedFiles.join(' | ')}`)
    }
  }

  for (const doc of docs) {
    const baseName = path.basename(doc.file)

    if (baseName === '00.目录.md' && doc.frontmatter) {
      const dirName = path.basename(path.dirname(doc.file)).replace(/^\d+\./, '')
      if (doc.frontmatter.title && doc.frontmatter.title !== dirName) {
        issues.catalogueTitleMismatch.push(`${doc.file} title='${doc.frontmatter.title}' expected='${dirName}'`)
      }
    }

    if (baseName === '00.简介.md' && !doc.file.startsWith('docs/@pages/')) {
      const required = ['title', 'date', 'permalink', 'categories', 'tags']
      const missing = required.filter((key) => !(key in (doc.frontmatter ?? {})))
      if (missing.length) {
        issues.introMissingKeys.push(`${doc.file} missing: ${missing.join(',')}`)
      }

      if (doc.frontmatter && typeof doc.frontmatter.title === 'string' && !doc.frontmatter.title.includes('简介')) {
        issues.introTitleNotIntro.push(`${doc.file} title='${doc.frontmatter.title}'`)
      }
    }
  }

  const permalinkSet = new Set([...permalinkMap.keys()])

  for (const doc of docs) {
    const missingLinks = []

    for (const match of doc.content.matchAll(/\[[^\]]+\]\((\/[^)\s#]+)\)/g)) {
      const target = match[1].replace(/\/$/, '')
      if (target !== '/' && !permalinkSet.has(target)) missingLinks.push(target)
    }

    for (const match of doc.content.matchAll(/link:\s*(\/\S+)/g)) {
      const target = match[1].replace(/\/$/, '')
      if (target !== '/' && !permalinkSet.has(target)) missingLinks.push(target)
    }

    if (missingLinks.length) {
      issues.brokenInternalLinks.push(`${doc.file} -> ${[...new Set(missingLinks)].join(', ')}`)
    }
  }

  if (fs.existsSync(configPath)) {
    const config = readFile(configPath)
    const navLinks = new Set([...config.matchAll(/link:\s*'([^']+)'/g)].map((m) => m[1].replace(/\/$/, '')))

    const topDirs = fs
      .readdirSync(docsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^\d+\./.test(entry.name))
      .map((entry) => entry.name)

    for (const dir of topDirs) {
      const introPath = path.join(docsRoot, dir, '00.简介.md')
      if (!fs.existsSync(introPath)) continue

      const fm = parseFrontmatter(readFile(introPath))
      const permalink = typeof fm?.permalink === 'string' ? fm.permalink.replace(/\/$/, '') : ''
      if (permalink && !navLinks.has(permalink)) {
        issues.navUncoveredTopDirs.push(`${dir} (${permalink})`)
      }
    }
  }

  return issues
}

function printReport(issues) {
  const sections = Object.entries(issues).filter(([, items]) => items.length > 0)
  if (!sections.length) {
    console.log('Docs style check passed: no issues found.')
    return 0
  }

  console.log('Docs style check found issues:\n')
  for (const [name, items] of sections) {
    console.log(`[${name}]`)
    for (const item of items) console.log(`- ${item}`)
    console.log('')
  }

  return 1
}

const result = scan()
const exitCode = printReport(result)
process.exit(exitCode)
