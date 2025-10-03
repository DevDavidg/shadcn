import { describe, it, expect } from 'vitest'
import { cn, formatDate, slugify } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      const date = new Date('2023-12-25')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/December 25, 2023/)
    })
  })

  describe('slugify', () => {
    it('converts text to slug', () => {
      expect(slugify('Hello World!')).toBe('hello-world')
      expect(slugify('Test & Example')).toBe('test-example')
    })
  })
})
