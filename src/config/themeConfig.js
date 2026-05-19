// themeConfig.js
// Visual theme overrides per scene/level.
// Used by PlayingField and GameBoard to set CSS variables.

export const THEMES = {
  hub: {
    fieldBg:   '#0d2a0d',
    stripBg:   '#081408',
    accentTop: '#4caf50',
    label:     'The Hub',
  },
  1: {
    fieldBg:   '#0f3460',
    stripBg:   '#0d1b2a',
    accentTop: '#e94560',
    label:     'Level 1 — The Tutorial',
  },
  2: {
    fieldBg:   '#050510',
    stripBg:   '#020208',
    accentTop: '#f5a623',
    label:     'Level 2 — In the Dark',
  },
  3: {
    fieldBg:   '#0a1f3a',
    stripBg:   '#060f1e',
    accentTop: '#2196f3',
    label:     'Level 3 — Two Are Better',
  },
  4: {
    fieldBg:   '#1a0f00',
    stripBg:   '#0d0800',
    accentTop: '#f5a623',
    label:     'Level 4 — Strength in Preparation',
  },
  5: {
    fieldBg:   '#1a001a',
    stripBg:   '#0d000d',
    accentTop: '#e040fb',
    label:     'Level 5 — Follow the Way',
  },
  6: {
    fieldBg:   '#0d0d1f',
    stripBg:   '#06060f',
    accentTop: '#7c4dff',
    label:     'Level 6 — Two Voices',
  },
  7: {
    fieldBg:   '#1f0a00',
    stripBg:   '#0f0500',
    accentTop: '#ff6d00',
    label:     'Level 7 — The Temptation',
  },
  8: {
    fieldBg:   '#001a1a',
    stripBg:   '#000d0d',
    accentTop: '#00bcd4',
    label:     'Level 8 — Persistence',
  },
  9: {
    fieldBg:   '#0d001a',
    stripBg:   '#060010',
    accentTop: '#e91e63',
    label:     'Level 9 — What Glitters',
  },
  10: {
    fieldBg:   '#0a0f0a',
    stripBg:   '#050805',
    accentTop: '#69f0ae',
    label:     'Level 10 — Work and Worth',
  },
}

export function getTheme(scene) {
  return THEMES[scene] ?? THEMES[1]
}