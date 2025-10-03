'use client'

import { Button } from './button'
import { Palette } from 'lucide-react'

export function ThemeEditorButton() {
  const handleClick = () => {
    window.location.href = '/marketing'
  }

  return (
    <Button
      className="w-full justify-start"
      variant="outline"
      onClick={handleClick}
    >
      <Palette className="mr-2 h-4 w-4" />
      Theme Editor
    </Button>
  )
}
