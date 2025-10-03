import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs))
}

export type DateInput = Date | string | number

const dateOpts = {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
} as const satisfies Intl.DateTimeFormatOptions

const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })

const toDate = (d: DateInput): Date => (d instanceof Date ? d : new Date(d))

export function formatDate(date: DateInput) {
  return new Intl.DateTimeFormat('en-US', dateOpts).format(toDate(date))
}

export function formatRelativeTime(date: DateInput) {
  const now = Date.now()
  const target = toDate(date).getTime()
  const diffSec = Math.floor((target - now) / 1000)

  if (Math.abs(diffSec) < 60) return 'just now'
  if (Math.abs(diffSec) < 3600)
    return rtf.format(Math.round(diffSec / 60), 'minute')
  if (Math.abs(diffSec) < 86400)
    return rtf.format(Math.round(diffSec / 3600), 'hour')
  if (Math.abs(diffSec) < 2592000)
    return rtf.format(Math.round(diffSec / 86400), 'day')

  return formatDate(target)
}

const DIACRITICS_RE = /[\u0300-\u036f]/g
const NON_WORD_SPACE_DASH_RE = /[^\w\s-]/g
const SPACE_UNDERSCORE_DASH_RE = /[\s_-]+/g
const EDGE_DASHES_RE = /(^-+)|(-+$)/g

export function slugify(text: string) {
  return text
    .normalize('NFKD')
    .replace(DIACRITICS_RE, '')
    .toLowerCase()
    .replace(NON_WORD_SPACE_DASH_RE, '')
    .replace(SPACE_UNDERSCORE_DASH_RE, '-')
    .replace(EDGE_DASHES_RE, '')
}

export function debounce<T extends (..._args: any[]) => void>(
  func: T,
  wait: number
): (..._args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined
  return (..._args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func(..._args)
    }, wait)
  }
}

export function throttle<T extends (..._args: any[]) => void>(
  func: T,
  limit: number
): (..._args: Parameters<T>) => void {
  let inThrottle = false
  return (..._args: Parameters<T>) => {
    if (!inThrottle) {
      func(..._args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}
