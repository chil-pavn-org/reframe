# Reframe

A multi-format blog platform that turns topics into styled blog posts using LLMs. Posts come in two formats: **story** (narrative parables) and **interactive** (dual-perspective explorations with personality quizzes).

## Project Structure

```
content/
  templates/       # LLM prompt templates (story-prompt.md, interactive-prompt.md)
  scenarios/       # Generated blog post data (JSON per scenario)
scripts/
  generate.js      # CLI tool to generate new posts via LLM
  adapters/        # LLM provider adapters (claude-cli, claude, openai, gemini)
site/              # React + Vite frontend (Tailwind CSS v4)
docs/              # Voice guide and style documentation
```

## Prerequisites

- Node.js >= 20
- [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) (for the default `claude-cli` adapter, no API key needed)
- Or an API key for OpenAI / Gemini / Claude API if using those adapters

## Getting Started

### 1. Install site dependencies

```sh
cd site
npm install
```

### 2. Run the dev server

```sh
cd site
npm run dev
```

This starts Vite at `http://localhost:5173` with hot reload.

### 3. Build for production

```sh
cd site
npm run build
```

Output goes to `site/dist/`. The project deploys to Netlify from the `site/` directory.

## Generating Content

Use `scripts/generate.js` to create new blog posts from a topic:

```sh
# Story format (narrative parable)
node scripts/generate.js --type story --topic "Your topic here"

# Interactive format (dual-perspective + quiz)
node scripts/generate.js --type interactive --topic "Your topic here"
```

### Options

| Flag | Short | Description |
|------|-------|-------------|
| `--type` | `-t` | Post format: `story` or `interactive` (required) |
| `--topic` | | The topic to write about (required) |
| `--adapter` | `-a` | LLM provider: `claude-cli` (default), `openai`, `gemini`, `claude` |
| `--slug` | `-s` | Custom URL slug (auto-generated from title if omitted) |
| `--dry` | | Print the prompt without calling the LLM |

### Adapters

- **claude-cli** (default) — Uses your Claude Code subscription via the `claude` CLI. No API key needed.
- **claude** — Anthropic API. Requires `ANTHROPIC_API_KEY`.
- **openai** — OpenAI API. Requires `OPENAI_API_KEY`.
- **gemini** — Google Gemini API. Requires `GEMINI_API_KEY`.

### Output

Generated content is written to `content/scenarios/<slug>/` as JSON files:

- **Story**: `meta.json`, `content.json`
- **Interactive**: `meta.json`, `questions.json`, `router.json`, `perspectives.json`

## Deployment

Configured for Netlify. The `netlify.toml` builds from `site/` and publishes `dist/` with SPA fallback routing.

## Tech Stack

- **Frontend**: React 19, React Router 7, Tailwind CSS 4, Vite 7
- **Content generation**: Node.js CLI with pluggable LLM adapters
- **Deployment**: Netlify
