export const ONE_DARK = {
  editorBg: '#282c34',
  panelBg: '#21252b',
  border: '#181a1f',
  gutter: '#21252b',
  text: '#abb2bf',
  textMuted: '#7f848e',
  key: '#c678dd',
  string: '#98c379',
  number: '#d19a66',
  boolean: '#e5c07b',
  nullish: '#56b6c2',
  punct: '#61afef',
  error: '#e06c75',
  errorBg: 'rgba(224,108,117,0.18)',
  caret: '#ffffff'
} as const

export const DEFAULT_THEME = `{
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#64748b",
    "accent": "#f59e0b",
    "background": "#ffffff",
    "surface": "#f8fafc",
    "text": "#1e293b",
    "textMuted": "#64748b"
  },
  "typography": {
    "fontFamily": {
      "sans": ["Inter", "system-ui", "sans-serif"],
      "mono": ["JetBrains Mono", "monospace"]
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem"
    }
  },
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem"
  },
  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px"
  }
}` as const
