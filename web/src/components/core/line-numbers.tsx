import React, { forwardRef } from 'react'

interface LineNumbersProps {
  lines: string[]
  style?: React.CSSProperties
}

export const LineNumbers = forwardRef<HTMLDivElement, LineNumbersProps>(
  ({ lines, style }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute left-0 top-0 h-full w-12 select-none overflow-hidden py-4 text-right text-sm leading-6"
        style={style}
      >
        {lines.map((_, idx) => (
          <div key={`line-${idx + 1}`} className="px-2">
            {idx + 1}
          </div>
        ))}
      </div>
    )
  }
)

LineNumbers.displayName = 'LineNumbers'
