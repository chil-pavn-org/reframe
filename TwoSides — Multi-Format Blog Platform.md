# TwoSides — Multi-Format Blog Platform
## Problem
The current `demo.js` is a single hardcoded React component. We need to turn this into a repeatable system where:
* Content is data (JSON), separate from presentation
* Multiple content formats are supported (not just the quiz-based interactive)
* New blogs are added by generating content files, not editing React code
* The site auto-deploys to Netlify on push
## Content Types
### Type 1: `interactive` (current demo.js)
Quiz → Router (Mirror/Window) → Dual-perspective narrative → Bridge to flip.
Used when a topic has two clear opposing viewpoints and you want the reader sorted.
### Type 2: `story`
Straight narrative blog. No quiz, no router. Just a story with a takeaway.
Examples: the rock-carrying metaphor, a parable, a single-concept explainer.
The site renders it as a clean article — no interactive machinery.
### Future types
Could add `hybrid` (story with optional embedded quiz), `listicle`, etc. The schema is extensible via the `type` field in `meta.json`.
## Content Schema
Every scenario lives in `content/scenarios/<slug>/` and always has a `meta.json`.
### `meta.json` (all types)
```json
{
  "slug": "tuesday-night-meltdown",
  "title": "The Tuesday Night Meltdown",
  "subtitle": "Two people. One argument. Two completely different realities.",
  "type": "interactive",
  "date": "2026-02-21",
  "tags": ["relationships", "communication"]
}
```
### Interactive-only files
`questions.json`
```json
[
  {
    "id": 1,
    "question": "The world is ending. Who do you trust to save it?",
    "options": [
      { "id": "A", "text": "Dr. House / Sherlock Holmes", "sub": "Brutal competence, even if they're mean.", "type": "fixer" },
      { "id": "B", "text": "Ted Lasso / Captain America", "sub": "Unwavering hope and team unity.", "type": "feeler" }
    ]
  }
]
```
`router.json`
```json
{
  "headline": "We've found your match.",
  "types": {
    "fixer": { "label": "Logic & Solutions" },
    "feeler": { "label": "Empathy & Connection" }
  },
  "options": {
    "mirror": {
      "title": "Mirror",
      "description": "Show me the perspective I agree with. Validate my feelings first.",
      "footer": "Recommended for comfort"
    },
    "window": {
      "title": "Window",
      "description": "Show me the opposing perspective. Challenge me immediately.",
      "footer": "Recommended for growth"
    }
  }
}
```
`perspectives.json`
```json
{
  "fixer": {
    "title": "The Architect of Solutions",
    "subtitle": "Why I handed you a wrench when you were crying.",
    "color": "blue",
    "content": "<p>HTML content...</p>"
  },
  "feeler": {
    "title": "The Keeper of the Vibe",
    "subtitle": "Why I needed a hug, not a lecture.",
    "color": "rose",
    "content": "<p>HTML content...</p>"
  },
  "bridge": {
    "prompt": "There are two sides to every story.",
    "cta": "Flip the Narrative"
  }
}
```
### Story-only files
`content.json`
```json
{
  "sections": [
    {
      "type": "narrative",
      "content": "<p>Two travellers walk the same mountain road...</p>"
    },
    {
      "type": "scene",
      "label": "The First Rock",
      "content": "<p>A stone flies from the hillside and strikes them both...</p>"
    },
    {
      "type": "reflection",
      "content": "<p>The weight we carry is a choice we make every morning.</p>"
    },
    {
      "type": "takeaway",
      "content": "<p>Let go or be buried.</p>"
    }
  ]
}
```
Section types (`narrative`, `scene`, `reflection`, `takeaway`) map to visual treatments in the React renderer — different typography, spacing, or accent colors. New section types can be added later.
## Repo Structure
```warp-runnable-command
blogs/
├── content/
│   ├── scenarios/
│   │   ├── tuesday-night-meltdown/     # type: interactive
│   │   │   ├── meta.json
│   │   │   ├── questions.json
│   │   │   ├── router.json
│   │   │   └── perspectives.json
│   │   └── rocks-on-your-back/          # type: story
│   │       ├── meta.json
│   │       └── content.json
│   └── templates/
│       ├── interactive-prompt.md        # prompt template for LLM: interactive type
│       └── story-prompt.md             # prompt template for LLM: story type
│
├── site/                               # Vite + React app
│   ├── src/
│   │   ├── main.jsx                    # entry
│   │   ├── App.jsx                     # router: homepage vs scenario page
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # lists all scenarios from catalog
│   │   │   └── ScenarioPage.jsx        # loads scenario by slug, delegates to renderer
│   │   ├── renderers/
│   │   │   ├── InteractiveRenderer.jsx # quiz → router → perspectives → bridge
│   │   │   └── StoryRenderer.jsx       # straight narrative with section styling
│   │   ├── components/
│   │   │   ├── Layout.jsx              # shared nav, footer
│   │   │   ├── Quiz.jsx
│   │   │   ├── Router.jsx              # mirror/window chooser
│   │   │   ├── PerspectiveView.jsx
│   │   │   └── Bridge.jsx
│   │   └── lib/
│   │       └── loadScenarios.js        # imports all scenario JSON at build time
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── scripts/
│   ├── generate.js                     # CLI: takes topic + type → calls LLM → writes JSON
│   └── adapters/                       # LLM API adapters (API-agnostic)
│       ├── base.js                     # interface definition
│       ├── openai.js
│       ├── gemini.js
│       └── claude.js
│
├── docs/
│   ├── project_strategy_brief.md       # moved from root
│   └── router_question_options.md      # moved from root
│
├── netlify.toml
├── package.json                        # root workspace (scripts + site)
└── README.md
```
## Site Architecture
### Routing (client-side, react-router)
* `/` → `HomePage` — grid of all scenario cards (reads `meta.json` from each)
* `/:slug` → `ScenarioPage` — loads scenario by slug, checks `meta.type`, renders with appropriate renderer
### Renderer pattern
`ScenarioPage` acts as a dispatcher:
```js
if (meta.type === 'interactive') return <InteractiveRenderer data={scenario} />
if (meta.type === 'story') return <StoryRenderer data={scenario} />
```
Adding a new content type = add a new renderer + a new content schema. Everything else stays the same.
### Build-time content loading
Vite's `import.meta.glob` will import all `content/scenarios/*/meta.json` at build time. No API server needed — content is baked into the static bundle.
## Generation Script (`scripts/generate.js`)
CLI interface:
```warp-runnable-command
node scripts/generate.js \
  --type interactive \
  --topic "Planner vs Spontaneous traveller" \
  --adapter openai
```
Or for story type:
```warp-runnable-command
node scripts/generate.js \
  --type story \
  --topic "Carrying rocks: why holding onto pain slows you down" \
  --adapter gemini
```
Flow:
1. Reads the matching prompt template from `content/templates/`
2. Injects the topic into the template
3. Calls the chosen LLM adapter
4. Parses the LLM response into the correct JSON schema
5. Validates the output against the schema
6. Writes files to `content/scenarios/<auto-slug>/`
Adapter interface (in `adapters/base.js`):
```js
export class LLMAdapter {
  async generate(prompt) { throw new Error('Not implemented') }
}
```
Each adapter (openai.js, gemini.js, claude.js) extends this and handles auth/API calls. The user sets their API key via env var (`OPENAI_API_KEY`, `GEMINI_API_KEY`, etc.).
## Netlify Config
`netlify.toml`:
```toml
[build]
  base = "site"
  command = "npm run build"
  publish = "dist"
```
Auto-deploys on push to main. Branch deploy previews enabled by default.
## Implementation Order
1. Scaffold repo structure and move existing docs
2. Initialize Vite + React + Tailwind in `site/`
3. Define content schema — extract demo.js data into JSON files for the first scenario
4. Build the site: renderers, pages, routing, build-time content loading
5. Add the story type: create a sample story scenario + StoryRenderer
6. Set up Netlify config
7. Build the generation script with adapter pattern
8. Create prompt templates for both content types
