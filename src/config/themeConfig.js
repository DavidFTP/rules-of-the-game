export const THEMES = {
  hub: {
    fieldBg:   '#0d2a0d',
    stripBg:   '#081408',
    accentTop: '#4caf50',
    labelKey:  'theme.hub',
  },
  1: {
    fieldBg:   '#0f3460',
    stripBg:   '#0d1b2a',
    accentTop: '#e94560',
    labelKey:  'theme.1',
  },
  2: {
    fieldBg:   '#050510',
    stripBg:   '#020208',
    accentTop: '#f5a623',
    labelKey:  'theme.2',
  },
  3: {
    fieldBg:   '#0a1f3a',
    stripBg:   '#060f1e',
    accentTop: '#2196f3',
    labelKey:  'theme.3',
  },
  4: {
    fieldBg:   '#1a0f00',
    stripBg:   '#0d0800',
    accentTop: '#f5a623',
    labelKey:  'theme.4',
  },
  5: {
    fieldBg:   '#1a001a',
    stripBg:   '#0d000d',
    accentTop: '#e040fb',
    labelKey:  'theme.5',
  },
  6: {
    fieldBg:   '#0d0d1f',
    stripBg:   '#06060f',
    accentTop: '#7c4dff',
    labelKey:  'theme.6',
  },
  7: {
    fieldBg:   '#1f0a00',
    stripBg:   '#0f0500',
    accentTop: '#ff6d00',
    labelKey:  'theme.7',
  },
  8: {
    fieldBg:   '#001a1a',
    stripBg:   '#000d0d',
    accentTop: '#00bcd4',
    labelKey:  'theme.8',
  },
  9: {
    fieldBg:   '#0d001a',
    stripBg:   '#060010',
    accentTop: '#e91e63',
    labelKey:  'theme.9',
  },
  10: {
    fieldBg:   '#0a0f0a',
    stripBg:   '#050805',
    accentTop: '#69f0ae',
    labelKey:  'theme.10',
  },
}

export function getTheme(scene) {
  return THEMES[scene] ?? THEMES[1]
}
