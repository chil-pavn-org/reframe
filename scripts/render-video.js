#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.resolve(__dirname, '../content/scenarios');
const VIDEO_DIR = path.resolve(__dirname, '../video');
const OUT_DIR = path.resolve(VIDEO_DIR, 'out');

const { values } = parseArgs({
  options: {
    slug: { type: 'string', short: 's' },
    format: { type: 'string', short: 'f', default: 'reel' },
    scene: { type: 'string' },
  },
});

if (!values.slug) {
  console.error('Usage: node scripts/render-video.js --slug <fable-slug> [--format reel|full] [--scene N]');
  process.exit(1);
}

const FORMAT_CONFIG = {
  reel: { compositionId: 'FableReel', width: 1080, height: 1920 },
  full: { compositionId: 'FableFull', width: 1920, height: 1080 },
};

async function main() {
  const { slug, format } = values;

  if (!FORMAT_CONFIG[format]) {
    console.error(`Unknown format: "${format}". Must be "reel" or "full".`);
    process.exit(1);
  }

  const scenarioDir = path.join(CONTENT_DIR, slug);
  const metaPath = path.join(scenarioDir, 'meta.json');
  const contentPath = path.join(scenarioDir, 'content.json');

  if (!fs.existsSync(metaPath) || !fs.existsSync(contentPath)) {
    console.error(`Scenario not found: ${scenarioDir}`);
    console.error('Ensure both meta.json and content.json exist.');
    process.exit(1);
  }

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'));

  if (meta.type !== 'fable') {
    console.error(`Scenario "${slug}" is type "${meta.type}", not "fable". Video rendering only supports fables.`);
    process.exit(1);
  }

  const config = FORMAT_CONFIG[format];
  const inputProps = { meta, content };

  console.log(`\nRendering "${meta.title}" as ${format} (${config.width}x${config.height})`);
  console.log(`Bundling Remotion project...`);

  const bundleLocation = await bundle({
    entryPoint: path.join(VIDEO_DIR, 'src/index.ts'),
    webpackOverride: (config) => config,
  });

  console.log(`Selecting composition: ${config.compositionId}`);

  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: config.compositionId,
    inputProps,
  });

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outputPath = path.join(OUT_DIR, `${slug}-${format}.mp4`);

  console.log(`Rendering to: ${outputPath}`);
  console.log(`Duration: ${composition.durationInFrames} frames @ ${composition.fps}fps (${(composition.durationInFrames / composition.fps).toFixed(1)}s)`);

  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps,
    onProgress: ({ progress }) => {
      if (Math.round(progress * 100) % 10 === 0) {
        process.stdout.write(`\rProgress: ${Math.round(progress * 100)}%`);
      }
    },
  });

  console.log(`\nDone! Output: ${outputPath}`);
}

main().catch((err) => {
  console.error('Render failed:', err.message);
  process.exit(1);
});
