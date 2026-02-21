// Load all scenario meta files at build time
const metaFiles = import.meta.glob('@content/scenarios/*/meta.json', { eager: true });

// Load all content files (questions, router, perspectives, content)
const allFiles = import.meta.glob('@content/scenarios/*/*.json', { eager: true });

/**
 * Get the catalog of all scenarios (for the homepage)
 */
export function getScenarioCatalog() {
  return Object.entries(metaFiles).map(([path, mod]) => {
    const meta = mod.default || mod;
    return meta;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Load a full scenario by slug.
 * Returns { meta, questions?, router?, perspectives?, content? }
 */
export function getScenarioBySlug(slug) {
  // Find all files for this slug
  const prefix = `/content/scenarios/${slug}/`;
  // Also match the aliased path
  const scenarioFiles = {};

  for (const [path, mod] of Object.entries(allFiles)) {
    // Path will be something like "/@content/scenarios/slug/meta.json" or similar
    if (path.includes(`/${slug}/`)) {
      const fileName = path.split('/').pop().replace('.json', '');
      scenarioFiles[fileName] = mod.default || mod;
    }
  }

  if (!scenarioFiles.meta) return null;

  return scenarioFiles;
}
