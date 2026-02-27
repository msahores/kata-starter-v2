import { createInterface } from 'node:readline'
import { stdin, stdout } from 'node:process'
import { writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function toTitleCase(str) {
  return str
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

function isValidKataName(name) {
  return /^[a-z][a-z0-9-]*$/.test(name)
}

function isValidIdentifier(name) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)
}

function generateSource(functionName, description) {
  const lines = []
  if (description) lines.push(`// ${description}`)
  lines.push(`export function ${functionName}() {`)
  lines.push('  // TODO: implement')
  lines.push('}')
  lines.push('')
  return lines.join('\n')
}

function generateTest(functionName, kataName, description) {
  const lines = []
  lines.push("import { describe, it, expect } from 'vitest'")
  lines.push(`import { ${functionName} } from './${kataName}'`)
  lines.push('')
  if (description) lines.push(`// ${description}`)
  lines.push(`describe('${functionName}', () => {`)
  lines.push("  it('should ', () => {")
  lines.push(`    expect(${functionName}()).toBe(undefined)`)
  lines.push('  })')
  lines.push('})')
  lines.push('')
  return lines.join('\n')
}

function generateKataMd(title, description) {
  const lines = []
  lines.push(`# ${title}`)
  lines.push('')
  if (description) {
    lines.push(description)
    lines.push('')
  }
  lines.push('## Examples')
  lines.push('')
  lines.push('<!-- Add examples here -->')
  lines.push('')
  return lines.join('\n')
}

function generateMainTs(title) {
  return `import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = \`
  <div>
    <h1>${title}</h1>
  </div>
\`
`
}

function generateStyleCss() {
  return `:root {
  font-family: 'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color: #e2e8f0;
  background-color: #121212;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
  color: #f8fafc;
}
`
}

function safeWriteFile(filePath, content) {
  if (existsSync(filePath)) {
    return false
  }
  writeFileSync(filePath, content, 'utf-8')
  return true
}

function readLines() {
  return new Promise((resolve) => {
    const lines = []
    const rl = createInterface({ input: stdin, terminal: false })
    rl.on('line', (line) => lines.push(line))
    rl.on('close', () => resolve(lines))
  })
}

function createPrompter() {
  if (stdin.isTTY) {
    const rl = createInterface({ input: stdin, output: stdout })
    return {
      ask(prompt) {
        return new Promise((resolve) => {
          rl.question(prompt, (answer) => resolve(answer))
        })
      },
      close() {
        rl.close()
      },
    }
  }

  let lines = null
  let index = 0
  return {
    async ask(prompt) {
      if (!lines) lines = await readLines()
      stdout.write(prompt)
      const answer = lines[index] || ''
      index++
      console.log(answer)
      return answer
    },
    close() {},
  }
}

async function main() {
  const prompter = createPrompter()

  try {
    console.log('\n🥋 Init Kata\n')

    const kataName = await prompter.ask('Kata name (e.g., "fizzbuzz"): ')
    if (!kataName || !isValidKataName(kataName)) {
      console.error(
        'Invalid kata name. Use lowercase letters, numbers, and hyphens (e.g., "fizzbuzz", "roman-numerals").',
      )
      process.exit(1)
    }

    const defaultFn = toCamelCase(kataName)
    const fnInput = await prompter.ask(
      `Function name (default: "${defaultFn}"): `,
    )
    const functionName = fnInput || defaultFn
    if (!isValidIdentifier(functionName)) {
      console.error(
        'Invalid function name. Must be a valid JavaScript identifier.',
      )
      process.exit(1)
    }

    const description = await prompter.ask('Description (optional): ')

    const domInput = await prompter.ask('Include DOM support? (y/N): ')
    const includeDOM = domInput.toLowerCase() === 'y'

    const title = toTitleCase(kataName)
    const srcDir = join(root, 'src')
    const created = []
    const skipped = []

    // Source file
    const srcPath = join(srcDir, `${kataName}.ts`)
    if (safeWriteFile(srcPath, generateSource(functionName, description))) {
      created.push(`src/${kataName}.ts`)
    } else {
      skipped.push(`src/${kataName}.ts`)
    }

    // Test file
    const testPath = join(srcDir, `${kataName}.test.ts`)
    if (
      safeWriteFile(
        testPath,
        generateTest(functionName, kataName, description),
      )
    ) {
      created.push(`src/${kataName}.test.ts`)
    } else {
      skipped.push(`src/${kataName}.test.ts`)
    }

    // KATA.md
    const kataMdPath = join(root, 'KATA.md')
    if (safeWriteFile(kataMdPath, generateKataMd(title, description))) {
      created.push('KATA.md')
    } else {
      skipped.push('KATA.md')
    }

    // DOM support
    if (includeDOM) {
      const mainPath = join(srcDir, 'main.ts')
      if (safeWriteFile(mainPath, generateMainTs(title))) {
        created.push('src/main.ts')
      } else {
        skipped.push('src/main.ts')
      }

      const cssPath = join(srcDir, 'style.css')
      if (safeWriteFile(cssPath, generateStyleCss())) {
        created.push('src/style.css')
      } else {
        skipped.push('src/style.css')
      }

      // Uncomment script tag in index.html
      const indexPath = join(root, 'index.html')
      const html = readFileSync(indexPath, 'utf-8')
      const updated = html.replace(
        '<!-- <script type="module" src="/src/main.ts"></script> -->',
        '<script type="module" src="/src/main.ts"></script>',
      )
      if (updated !== html) {
        writeFileSync(indexPath, updated, 'utf-8')
        created.push('index.html (updated)')
      }
    }

    console.log('\nKata initialized!\n')

    if (created.length) {
      console.log('Created:')
      created.forEach((f) => console.log(`  - ${f}`))
    }

    if (skipped.length) {
      console.log('\nSkipped (already exist):')
      skipped.forEach((f) => console.log(`  - ${f}`))
    }

    console.log('\nNext steps:')
    console.log('  1. Run `npm test` to start TDD')
    console.log(`  2. Implement your solution in src/${kataName}.ts`)
    console.log('')
  } finally {
    prompter.close()
  }
}

main()
