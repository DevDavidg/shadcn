import React, { forwardRef, useMemo } from 'react'
import { highlightJson, getPartStyle } from '@/lib/syntax-highlighting'

type LintError = {
  line: number
  column: number
  message: string
  type: 'json' | 'validation'
}

interface SyntaxHighlighterProps {
  readonly code: string
  readonly errors: LintError[]
  readonly style?: React.CSSProperties
}

export const SyntaxHighlighter = forwardRef<
  HTMLDivElement,
  SyntaxHighlighterProps
>(({ code, errors, style }, ref) => {
  const highlighted = useMemo(() => highlightJson(code, errors), [code, errors])

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-auto whitespace-pre-wrap break-words py-4 pl-16 pr-4 font-mono text-sm leading-6"
      style={{
        tabSize: 2,
        scrollbarWidth: 'thin',
        ...style
      }}
    >
      {highlighted.map((line) => (
        <div key={line.lineIndex} className="flex">
          {line.parts.map((part, pIdx) => {
            const hasError = line.errors.some(
              (e) => e.column >= part.start + 1 && e.column <= part.end + 1
            )
            const { className, style: partStyle } = getPartStyle(part, hasError)

            return (
              <span
                key={`${line.lineIndex}-${pIdx}`}
                className={className}
                style={partStyle}
              >
                {part.text}
              </span>
            )
          })}
        </div>
      ))}
      {'\u200B'}
    </div>
  )
})

SyntaxHighlighter.displayName = 'SyntaxHighlighter'
