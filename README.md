# Kata Starter V2

Template for starting katas and coding exercises with TypeScript.

## Requirements

- Node.js >= 18
- npm

## Quick start

```bash
# Clone the repository
git clone <repo-url>
cd kata-starter-V2

# Install dependencies
npm install

# Run tests in watch mode
npm test
```

## Create a new kata

```bash
npm run init-kata
```

The interactive script will ask you:

- **Kata name** (e.g., "fizzbuzz") — creates `src/fizzbuzz.ts` and `src/fizzbuzz.test.ts`
- **Function name** (e.g., "fizzBuzz") — defaults to camelCase of the kata name
- **Description** — saved in `KATA.md`
- **DOM support** (default: no) — if enabled, generates `main.ts`, `style.css` and enables `index.html`

## Manual usage

You can also create files manually:

1. Create your solution file in `src/`, e.g. `src/kata.ts`
2. Create the test file next to it: `src/kata.test.ts`
3. Run `npm test` and develop with TDD

## Scripts

| Command             | Description                     |
| ------------------- | ------------------------------- |
| `npm test`          | Run tests in watch mode         |
| `npm test -- --run` | Run tests once                  |
| `npm run dev`       | Start dev server                |
| `npm run build`     | TypeScript check + Vite build   |
| `npm run lint`      | Run ESLint                      |
| `npm run format`    | Format everything with Prettier |
| `npm run init-kata` | Create a new kata interactively |

## AI-assisted TDD workflow

This template supports a progressive TDD workflow with an AI coding assistant:

1. Run `npm run init-kata` to scaffold the kata files and `KATA.md`
2. Fill in `KATA.md` with the problem description, rules, examples, and edge cases
3. Ask your AI assistant to read `KATA.md` and generate all the tests
4. The AI creates tests using Vitest's `.todo` modifier so they start as pending
5. Activate one test at a time (remove `.todo`), watch it fail, write the minimum code to make it pass, refactor, and repeat

This gives you a structured red-green-refactor cycle where you control the pace.

## Stack

- **TypeScript** — Strict typing
- **Vite** — Bundler and dev server
- **Vitest** — Testing
- **ESLint + Prettier** — Linting and formatting
- **Husky + commitlint** — Git hooks and conventional commits

## Commit conventions

Uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: new feature
fix: bug fix
test: add or modify tests
refactor: code refactoring
chore: maintenance tasks
```
