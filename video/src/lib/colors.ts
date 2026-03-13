export const CHARACTER_PALETTES = [
  { bg: '#ecfdf5', border: '#a7f3d0', text: '#047857', accent: '#059669' },
  { bg: '#fffbeb', border: '#fcd34d', text: '#b45309', accent: '#d97706' },
  { bg: '#f5f3ff', border: '#c4b5fd', text: '#6d28d9', accent: '#7c3aed' },
  { bg: '#fff1f2', border: '#fecdd3', text: '#be123c', accent: '#e11d48' },
];

export function getCharacterPalette(name: string, allNames: string[]) {
  const index = allNames.indexOf(name);
  return CHARACTER_PALETTES[index >= 0 ? index % CHARACTER_PALETTES.length : 0];
}

export const COLORS = {
  bg: '#0f172a',
  bgLight: '#f8fafc',
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  white: '#ffffff',
  accent: '#059669',
};
