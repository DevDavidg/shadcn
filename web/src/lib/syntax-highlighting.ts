import {
  extractColor,
  normalizeCssColor,
  pickTextContrast
} from '@/lib/color-utils'
import { ONE_DARK } from '@/lib/constants'

export type TokenType =
  | 'string'
  | 'punctuation'
  | 'default'
  | 'key'
  | 'number'
  | 'boolean'
  | 'null'

export type Part = { text: string; type: TokenType; start: number; end: number }

type LintError = {
  line: number
  column: number
  message: string
  type: 'json' | 'validation'
}

function classifyBare(raw: string): TokenType {
  const t = raw.trim()
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(t)) return 'number'
  if (t === 'true' || t === 'false') return 'boolean'
  if (t === 'null') return 'null'
  return 'default'
}

function baseStyleFor(type: TokenType): React.CSSProperties {
  if (type === 'key') return { color: ONE_DARK.key }
  if (type === 'string') return { color: ONE_DARK.string }
  if (type === 'number') return { color: ONE_DARK.number }
  if (type === 'boolean') return { color: ONE_DARK.boolean }
  if (type === 'null') return { color: ONE_DARK.nullish }
  if (type === 'punctuation') return { color: ONE_DARK.punct }
  return { color: ONE_DARK.text }
}

export type HighlightedLine = {
  lineIndex: number
  parts: Part[]
  errors: LintError[]
}

function processString(
  line: string,
  i: number,
  stringChar: string,
  current: string,
  pushPart: (_txt: string, _type: TokenType) => void
): { newCurrent: string; newI: number; inString: boolean } {
  const ch = line[i]
  const newCurrent = current + ch

  if (ch === stringChar && line[i - 1] !== '\\') {
    const rest = line.slice(i + 1)
    const isKey = /^\s*:/.test(rest)
    pushPart(newCurrent, isKey ? 'key' : 'string')
    return { newCurrent: '', newI: i + 1, inString: false }
  }

  return { newCurrent, newI: i + 1, inString: true }
}

function processPunctuation(
  ch: string,
  current: string,
  pushPart: (_txt: string, _type: TokenType) => void
): { newCurrent: string } {
  if (current) {
    pushPart(current, classifyBare(current))
  }
  pushPart(ch, 'punctuation')
  return { newCurrent: '' }
}

function processLine(line: string, lineErrors: LintError[]): HighlightedLine {
  const parts: Part[] = []
  let current = ''
  let inString = false
  let stringChar = '"'
  let i = 0
  let offset = 0

  const pushPart = (txt: string, type: TokenType) => {
    const start = offset
    const end = start + txt.length
    parts.push({ text: txt, type, start, end })
    offset = end
  }

  while (i < line.length) {
    const ch = line[i]

    if (!inString && (ch === '"' || ch === "'")) {
      if (current) {
        pushPart(current, classifyBare(current))
        current = ''
      }
      inString = true
      stringChar = ch
      current += ch
      i++
      continue
    }

    if (inString) {
      const result = processString(line, i, stringChar, current, pushPart)
      current = result.newCurrent
      i = result.newI
      inString = result.inString
      continue
    }

    if (/[:,{}[]]/.test(ch)) {
      const result = processPunctuation(ch, current, pushPart)
      current = result.newCurrent
      i++
      continue
    }

    current += ch
    i++
  }

  if (current) pushPart(current, inString ? 'string' : classifyBare(current))

  return { lineIndex: 0, parts, errors: lineErrors }
}

export function highlightJson(
  text: string,
  errors: LintError[]
): HighlightedLine[] {
  const lines = text.split('\n')
  return lines.map((line, idx) => {
    const lineErrors = errors.filter((e) => e.line === idx + 1)
    const result = processLine(line, lineErrors)
    return { ...result, lineIndex: idx }
  })
}

export function getPartStyle(
  part: Part,
  hasError: boolean
): { className: string; style: React.CSSProperties } {
  const style: React.CSSProperties = baseStyleFor(part.type)
  let className = ''

  if (hasError) {
    className = 'px-1 rounded'
    style.color = ONE_DARK.error
    style.backgroundColor = ONE_DARK.errorBg
  } else if (part.type === 'string') {
    const colorText = extractColor(part.text)
    if (colorText) {
      const swatch = normalizeCssColor(colorText)
      const contrast = pickTextContrast(swatch)
      className = 'px-1 rounded'
      style.backgroundColor = swatch
      style.color = contrast
      style.boxShadow = 'inset 0 0 0 1px rgba(0,0,0,0.25)'
    }
  }

  return { className, style }
}
