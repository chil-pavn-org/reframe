#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '../content');
const SCENARIOS_DIR = path.join(CONTENT_DIR, 'scenarios');
const TEMPLATES_DIR = path.join(CONTENT_DIR, 'templates');

// --- Adapter registry ---
const ADAPTERS = {
  openai: () => import('./adapters/openai.js').then(m => new m.OpenAIAdapter()),
  gemini: () => import('./adapters/gemini.js').then(m => new m.GeminiAdapter()),
  claude: () => import('./adapters/claude.js').then(m => new m.ClaudeAdapter()),
  'claude-cli': () => import('./adapters/claude-cli.js').then(m => new m.ClaudeCLIAdapter()),
};

// --- CLI args ---
const { values } = parseArgs({
  options: {
    type: { type: 'string', short: 't' },
    topic: { type: 'string' },
    adapter: { type: 'string', short: 'a', default: 'claude-cli' },
    slug: { type: 'string', short: 's' },
    dry: { type: 'boolean', default: false },
  },
});

if (!values.type || !values.topic) {
  console.error('Usage: node generate.js --type <interactive|story|fable> --topic "Your topic" [--adapter claude-cli|openai|gemini|claude] [--slug custom-slug] [--dry]');
  process.exit(1);
}

// --- Helpers ---
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

function extractJSON(text) {
  // Strip markdown fences if the LLM wraps output
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

// --- Main ---
async function main() {
  const { type, topic, adapter: adapterName, slug: customSlug, dry } = values;

  // Validate type
  if (!['interactive', 'story', 'fable'].includes(type)) {
    console.error(`Unknown type: "${type}". Must be "interactive", "story", or "fable".`);
    process.exit(1);
  }

  // Load prompt template
  const templatePath = path.join(TEMPLATES_DIR, `${type}-prompt.md`);
  if (!fs.existsSync(templatePath)) {
    console.error(`Prompt template not found: ${templatePath}`);
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, 'utf-8');
  const prompt = template.replace(/\{\{TOPIC\}\}/g, topic);

  console.log(`\n📝 Generating "${type}" content for: "${topic}"`);
  console.log(`🔌 Using adapter: ${adapterName}\n`);

  if (dry) {
    console.log('--- DRY RUN: Prompt ---');
    console.log(prompt);
    console.log('--- END ---');
    return;
  }

  // Load adapter
  if (!ADAPTERS[adapterName]) {
    console.error(`Unknown adapter: "${adapterName}". Available: ${Object.keys(ADAPTERS).join(', ')}`);
    process.exit(1);
  }
  const adapter = await ADAPTERS[adapterName]();
  console.log(`⏳ Calling ${adapter.name} API...`);

  const rawResponse = await adapter.generate(prompt);
  const generated = extractJSON(rawResponse);

  // Determine slug
  const slug = customSlug || slugify(generated.meta?.title || topic);
  const scenarioDir = path.join(SCENARIOS_DIR, slug);

  // Write files
  fs.mkdirSync(scenarioDir, { recursive: true });

  if (type === 'interactive') {
    const meta = { ...generated.meta, slug, type: 'interactive', date: new Date().toISOString().split('T')[0] };
    fs.writeFileSync(path.join(scenarioDir, 'meta.json'), JSON.stringify(meta, null, 2));
    fs.writeFileSync(path.join(scenarioDir, 'questions.json'), JSON.stringify(generated.questions, null, 2));
    fs.writeFileSync(path.join(scenarioDir, 'router.json'), JSON.stringify(generated.router, null, 2));
    fs.writeFileSync(path.join(scenarioDir, 'perspectives.json'), JSON.stringify(generated.perspectives, null, 2));
    console.log(`✅ Written interactive scenario to: content/scenarios/${slug}/`);
    console.log(`   - meta.json, questions.json, router.json, perspectives.json`);
  } else if (type === 'fable') {
    const meta = { ...generated.meta, slug, type: 'fable', date: new Date().toISOString().split('T')[0] };
    fs.writeFileSync(path.join(scenarioDir, 'meta.json'), JSON.stringify(meta, null, 2));
    fs.writeFileSync(path.join(scenarioDir, 'content.json'), JSON.stringify({
      setup: generated.setup,
      scenes: generated.scenes,
      twist: generated.twist,
      moral_question: generated.moral_question,
    }, null, 2));
    console.log(`✅ Written fable scenario to: content/scenarios/${slug}/`);
    console.log(`   - meta.json, content.json`);
  } else {
    const meta = { ...generated.meta, slug, type: 'story', date: new Date().toISOString().split('T')[0] };
    fs.writeFileSync(path.join(scenarioDir, 'meta.json'), JSON.stringify(meta, null, 2));
    fs.writeFileSync(path.join(scenarioDir, 'content.json'), JSON.stringify(generated.content, null, 2));
    console.log(`✅ Written story scenario to: content/scenarios/${slug}/`);
    console.log(`   - meta.json, content.json`);
  }

  console.log(`\n🚀 Done! Run "npm run dev" in site/ to preview.`);
}

main().catch((err) => {
  console.error('❌ Generation failed:', err.message);
  process.exit(1);
});
