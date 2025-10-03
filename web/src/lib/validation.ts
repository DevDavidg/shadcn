export type LintError = {
  line: number
  column: number
  message: string
  type: 'json' | 'validation'
}

const VALID_KEYS = {
  colors: [
    'primary',
    'secondary',
    'accent',
    'background',
    'surface',
    'text',
    'textMuted'
  ],
  typography: ['fontFamily', 'fontSize'],
  spacing: ['xs', 'sm', 'md', 'lg', 'xl'],
  breakpoints: ['sm', 'md', 'lg', 'xl']
} as const

export function validateTheme(parsed: unknown, code: string): LintError[] {
  const validationErrors: LintError[] = []
  if (!parsed || typeof parsed !== 'object') return validationErrors

  const root = parsed as Record<string, unknown>

  Object.keys(root).forEach((key) => {
    if (!(key in VALID_KEYS)) {
      const lines = code.split('\n')
      const i = lines.findIndex((l) => l.includes(`"${key}"`))
      if (i !== -1) {
        validationErrors.push({
          line: i + 1,
          column: Math.max(1, lines[i].indexOf(`"${key}"`) + 1),
          message: `Unknown property "${key}". Expected one of: ${Object.keys(VALID_KEYS).join(', ')}`,
          type: 'validation'
        })
      }
    }
  })
  ;(['colors', 'typography', 'spacing', 'breakpoints'] as const).forEach(
    (section) => {
      if (!(section in root)) {
        validationErrors.push({
          line: 1,
          column: 1,
          message: `Missing required section "${section}"`,
          type: 'validation'
        })
      }
    }
  )

  return validationErrors
}

export function validateThemeCode(codeText: string): LintError[] {
  const out: LintError[] = []
  try {
    const parsed = JSON.parse(codeText)
    out.push(...validateTheme(parsed, codeText))
  } catch (err) {
    const message = err instanceof SyntaxError ? err.message : ''
    const pos = /position (\d+)/.exec(message)
    if (pos) {
      const p = parseInt(pos[1], 10)
      const before = codeText.slice(0, p)
      const lines = before.split('\n')
      out.push({
        line: lines.length,
        column: (lines.at(-1) ?? '').length + 1,
        message: 'Invalid JSON syntax',
        type: 'json'
      })
    } else {
      out.push({
        line: 1,
        column: 1,
        message: 'Invalid JSON syntax',
        type: 'json'
      })
    }
  }
  return out
}
