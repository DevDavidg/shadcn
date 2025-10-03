'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { CodeEditor } from '@/components/core/code-editor'
import { ErrorDisplay } from '@/components/core/error-display'
import { Button } from '@/components/ui/button'
import { ONE_DARK, DEFAULT_THEME } from '@/lib/constants'
import { validateThemeCode, type LintError } from '@/lib/validation'
import { useToast } from '@/components/ui/use-toast'
import { debounce } from '@/lib/utils'

export default function ThemeEditor() {
  const router = useRouter()
  const { toast } = useToast()
  const [code, setCode] = useState<string>(DEFAULT_THEME)
  const [errors, setErrors] = useState<LintError[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const validateCode = useCallback((codeText: string): LintError[] => {
    return validateThemeCode(codeText)
  }, [])

  const debouncedValidate = useMemo(
    () =>
      debounce((codeText: string) => setErrors(validateCode(codeText)), 140),
    [validateCode]
  )

  const formatCode = useCallback(() => {
    try {
      const parsed = JSON.parse(code)
      const formatted = JSON.stringify(parsed, null, 2)
      setCode(formatted)
      setErrors(validateThemeCode(formatted))
    } catch {
      setErrors(validateCode(code))
    }
  }, [code, validateCode])

  const handleCodeChange = (v: string) => {
    setCode(v)
    debouncedValidate(v)
  }

  const handleBlur = () => {
    formatCode()
  }

  const handleRun = async () => {
    if (errors.length > 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors before running the theme.',
        variant: 'destructive'
      })
      return
    }

    setIsRunning(true)

    try {
      const themeConfig = JSON.parse(code)
      const domain = `tenant-${Date.now()}.localhost:3000`

      const response = await fetch('/api/admin/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domain,
          config: themeConfig
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create tenant')
      }

      toast({
        title: 'Tenant Created',
        description: `Theme applied to ${domain}`
      })

      router.push(`/dashboard?tenant=${encodeURIComponent(domain)}`)
    } catch (error) {
      console.error('Failed to create tenant:', error)
      toast({
        title: 'Error',
        description:
          'Failed to create tenant. Please check your configuration.',
        variant: 'destructive'
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#000', color: ONE_DARK.text }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">Code Editor</h1>
          <p className="text-gray-400">
            Next SSR Starter — TypeScript/JavaScript
          </p>
        </div>

        <div
          className="overflow-hidden rounded-lg"
          style={{
            border: `1px solid ${ONE_DARK.border}`,
            backgroundColor: ONE_DARK.editorBg
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-2"
            style={{
              borderBottom: `1px solid ${ONE_DARK.border}`,
              backgroundColor: ONE_DARK.panelBg
            }}
          >
            <div className="flex items-center space-x-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: '#e06c75' }}
              />
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: '#e5c07b' }}
              />
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: '#98c379' }}
              />
            </div>
            <span className="text-sm">app/assets/theme.json</span>
          </div>

          <CodeEditor
            code={code}
            onCodeChange={handleCodeChange}
            onBlur={handleBlur}
            errors={errors}
          />
        </div>

        {errors.length > 0 && <ErrorDisplay errors={errors} />}

        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            style={{
              backgroundColor: ONE_DARK.panelBg,
              color: ONE_DARK.text,
              borderColor: ONE_DARK.border
            }}
            onClick={formatCode}
          >
            Save
          </Button>
          <Button
            size="sm"
            disabled={isRunning}
            style={{
              backgroundColor: ONE_DARK.punct,
              color: '#0b1117',
              borderColor: ONE_DARK.border
            }}
            onClick={handleRun}
          >
            {isRunning ? 'Creating...' : 'Run'}
          </Button>
        </div>
      </div>
    </div>
  )
}
