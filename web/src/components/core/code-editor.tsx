'use client'

import React, { useRef, useMemo } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { LineNumbers } from '@/components/core/line-numbers'
import { SyntaxHighlighter } from '@/components/core/syntax-highlighter'
import { cn, throttle } from '@/lib/utils'
import { ONE_DARK } from '@/lib/constants'

type LintError = {
  line: number
  column: number
  message: string
  type: 'json' | 'validation'
}

interface CodeEditorProps {
  readonly code: string
  readonly onCodeChange: (_value: string) => void
  readonly onBlur: () => void
  readonly errors: LintError[]
}

export function CodeEditor(props: CodeEditorProps) {
  const { code, onCodeChange, onBlur, errors } = props
  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLDivElement | null>(null)

  const onScrollSync = useMemo(
    () =>
      throttle((e: React.UIEvent<HTMLTextAreaElement>) => {
        if (!highlightRef.current || !lineNumbersRef.current) return
        const target = e.target as HTMLTextAreaElement
        highlightRef.current.scrollTop = target.scrollTop
        highlightRef.current.scrollLeft = target.scrollLeft
        lineNumbersRef.current.scrollTop = target.scrollTop
      }, 16),
    []
  )

  const lines = useMemo(() => code.split('\n'), [code])

  return (
    <div className="relative">
      <div className="relative">
        <div className="relative h-[500px]">
          <LineNumbers
            ref={lineNumbersRef}
            lines={lines}
            style={{
              backgroundColor: ONE_DARK.gutter,
              color: ONE_DARK.textMuted
            }}
          />

          <SyntaxHighlighter
            ref={highlightRef}
            code={code}
            errors={errors}
            style={{
              backgroundColor: ONE_DARK.editorBg,
              color: ONE_DARK.text
            }}
          />

          <Textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            onBlur={onBlur}
            onScroll={onScrollSync}
            className={cn(
              'scrollbar-hide absolute inset-0 h-full w-full resize-none border-0 bg-transparent py-4 pl-16 pr-4 font-mono text-sm leading-6 text-transparent caret-white selection:bg-white/20 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'
            )}
            style={{
              tabSize: 2,
              caretColor: ONE_DARK.caret,
              zIndex: 1,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          />
        </div>
      </div>
    </div>
  )
}
