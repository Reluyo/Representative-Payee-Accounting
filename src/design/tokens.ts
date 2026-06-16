// Direction A: "Calm & Rounded" design tokens

export const colors = {
  // Page & surfaces
  'bg/page': '#F4F7FB',
  'surface/card': '#FFFFFF',

  // Text
  'ink/primary': '#16263F',
  'ink/muted': '#5B6B82',
  'ink/disabled': '#8A98AC',

  // Brand
  'brand/primary': '#2F62D9',
  'brand/tint': '#E7EFFD',
  'brand/tint-strong': '#EEF3FB',

  // Borders
  'border/hairline': '#E3EAF4',
  'border/divider': '#EDF1F8',
  'border/btn-outline': '#CBD9F0',

  // Status
  'positive': '#1F8A5B',
  'warning': '#B57E1F',
  'warning/bg': '#FFFBF2',
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
  screenPadding: 22,
  gapLarge: 16,
  gapSmall: 12,
  gapXSmall: 10,
};

export const radius = {
  hero: 24,
  card: 20,
  button: 18,
  tile: 12,
  pill: 999,
};

export const shadows = {
  card: '0 6px 20px rgba(22, 38, 63, 0.06)',
  button: '0 6px 16px rgba(47, 98, 217, 0.28)',
};

export const typography = {
  heroBalance: { size: 46, weight: 800, lineHeight: 1, letterSpacing: '-1px' },
  screenTitle: { size: 30, weight: 800, lineHeight: 1.2 },
  greeting: { size: 23, weight: 800, lineHeight: 1.2 },
  sectionHeading: { size: 19, weight: 800, lineHeight: 1.3 },
  rowTitle: { size: 17, weight: 700, lineHeight: 1.3 },
  body: { size: 15, weight: 600, lineHeight: 1.4 },
  amount: { size: 17, weight: 800, lineHeight: 1.3 },
  statusChip: { size: 13, weight: 700, lineHeight: 1.3 },
  tabLabel: { size: 12, weight: 700, lineHeight: 1.3 },
  dateGroup: { size: 14, weight: 700, lineHeight: 1.3, letterSpacing: '0.5px' },
};
