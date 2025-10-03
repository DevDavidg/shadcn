import React from 'react'
import { ONE_DARK } from '@/lib/constants'

type LintError = {
  line: number
  column: number
  message: string
  type: 'json' | 'validation'
}

interface ErrorDisplayProps {
  readonly errors: LintError[]
}

export function ErrorDisplay({ errors }: ErrorDisplayProps) {
  if (errors.length === 0) return null

  return (
    <div
      className="mt-4 rounded-lg p-4"
      style={{
        border: `1px solid ${ONE_DARK.errorBg}`,
        background: 'rgba(224,108,117,0.08)'
      }}
    >
      <h3
        className="mb-2 text-sm font-semibold"
        style={{ color: ONE_DARK.error }}
      >
        Errors
      </h3>
      {errors.map((error, index) => (
        <div
          key={`error-${error.line}-${error.column}-${index}`}
          className="text-sm"
          style={{ color: ONE_DARK.error }}
        >
          <span className="font-mono">Line {error.line}:</span> {error.message}
        </div>
      ))}
    </div>
  )
}
