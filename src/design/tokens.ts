// Direction B: "Structured & Official" design tokens - Court-ready design

export const colors = {
  // Page & surfaces
  'bg/page': '#F5F7F9',
  'surface/card': '#FFFFFF',
  'header/bg': '#1E3A5F',
  'header/bg-accent': '#EAF0F7',

  // Text
  'ink/primary': '#1B2733',
  'ink/muted': '#5A6B7B',
  'ink/disabled': '#8A98AC',

  // Brand
  'brand/primary': '#1E3A5F',
  'brand/tint': '#EAF0F7',
  'brand/tint-strong': '#EFF3F7',
  'brand/accent': '#B5862B',

  // Borders
  'border/hairline': '#DCE3EA',
  'border/divider': '#ECF0F4',
  'border/btn-outline': '#C3D0DC',

  // Status
  'positive': '#1F8A5B',
  'warning': '#9A6B16',
  'warning/bg': '#FCF8EF',
};

export const categoryColors: Record<string, { bg: string; text: string; letter: string }> = {
  'Medical/Healthcare': { bg: '#E7EFFD', text: '#2F62D9', letter: 'M' },
  'Care Services': { bg: '#E2F2F1', text: '#2E8B8B', letter: 'C' },
  'Food & Groceries': { bg: '#E6F4E9', text: '#2F8B45', letter: 'G' },
  'Utilities': { bg: '#F7EEDD', text: '#B57E1F', letter: 'U' },
  'Housing & Rent': { bg: '#ECEAF8', text: '#6A5AC0', letter: 'H' },
  'Personal Care': { bg: '#F8E9EF', text: '#C45D7C', letter: 'P' },
};

export const spacing = {
  screenPadding: 16,
  gapLarge: 16,
  gapSmall: 12,
  gapXSmall: 10,
};

export const radius = {
  hero: 18,
  card: 14,
  button: 14,
  tile: 10,
  pill: 999,
};

export const shadows = {
  card: '0 12px 26px rgba(30, 58, 95, 0.24)',
  button: '0 0 0 0',
};

export const typography = {
  heroBalance: { size: 42, weight: 700, lineHeight: 1, letterSpacing: '-0.5px', fontFamily: "'Source Serif 4', serif" },
  screenTitle: { size: 25, weight: 700, lineHeight: 1.2, fontFamily: "'Source Serif 4', serif" },
  greeting: { size: 19, weight: 600, lineHeight: 1.2, fontFamily: "'Source Serif 4', serif" },
  sectionHeading: { size: 18, weight: 700, lineHeight: 1.3, fontFamily: "'Source Serif 4', serif" },
  rowTitle: { size: 17, weight: 700, lineHeight: 1.3 },
  body: { size: 15, weight: 600, lineHeight: 1.4 },
  amount: { size: 18, weight: 800, lineHeight: 1.3 },
  statusChip: { size: 13, weight: 700, lineHeight: 1.3 },
  tabLabel: { size: 12, weight: 800, lineHeight: 1.3 },
  dateGroup: { size: 14, weight: 700, lineHeight: 1.3, letterSpacing: '0.5px' },
};
