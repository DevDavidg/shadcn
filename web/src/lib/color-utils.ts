const COLOR_REGEX = /#[0-9a-fA-F]{3,8}|rgba?\([\d.\s%,]+\)|hsla?\([\d.\s%,]+\)/

export function extractColor(quoted: string): string | null {
  const inner = quoted.slice(1, -1)
  const m = COLOR_REGEX.exec(inner)
  return m ? m[0] : null
}

export function normalizeCssColor(input: string): string {
  if (input.startsWith('#')) {
    if (input.length === 4 || input.length === 5) {
      const r = input[1]
      const g = input[2]
      const b = input[3]
      const a = input.length === 5 ? input[4] : 'f'
      const hex = `#${r}${r}${g}${g}${b}${b}${a}${a}`
      return hexToRgba(hex)
    }
    if (input.length === 7) return input
    if (input.length === 9) return hexToRgba(input)
  }
  return input
}

export function hexToRgba(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

export function pickTextContrast(bgCss: string): string {
  const [r, g, b, a = 1] = parseCssColor(bgCss)
  const L = relativeLuminance(r, g, b)
  const whiteContrast = contrastRatio(L, relativeLuminance(255, 255, 255))
  const blackContrast = contrastRatio(L, relativeLuminance(0, 0, 0))
  const text = whiteContrast >= blackContrast ? 'white' : 'black'
  if (a < 0.35) return 'white'
  return text
}

export function parseCssColor(css: string): [number, number, number, number] {
  if (css.startsWith('rgb')) {
    const nums = css
      .replace(/[^\d.,]/g, '')
      .split(',')
      .map((v) => v.trim())
    const r = clamp255(parseFloat(nums[0] ?? '0'))
    const g = clamp255(parseFloat(nums[1] ?? '0'))
    const b = clamp255(parseFloat(nums[2] ?? '0'))
    const a =
      nums[3] !== undefined ? Math.max(0, Math.min(1, parseFloat(nums[3]))) : 1
    return [r, g, b, a]
  }
  if (css.startsWith('#')) {
    const rgba = hexToRgba(css)
    return parseCssColor(rgba)
  }
  if (css.startsWith('hsl')) {
    const nums = css
      .replace(/[^\d.,%]/g, '')
      .split(',')
      .map((v) => v.trim())
    const h = parseFloat(nums[0] ?? '0')
    const s = parseFloat((nums[1] ?? '0').replace('%', '')) / 100
    const l = parseFloat((nums[2] ?? '0').replace('%', '')) / 100
    const a =
      nums[3] !== undefined ? Math.max(0, Math.min(1, parseFloat(nums[3]))) : 1
    const [r, g, b] = hslToRgb(h, s, l)
    return [r, g, b, a]
  }
  return [0, 0, 0, 1]
}

function clamp255(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)))
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s
  const hp = (h % 360) / 60
  const x = c * (1 - Math.abs((hp % 2) - 1))
  let [r1, g1, b1]: [number, number, number] = [0, 0, 0]
  if (0 <= hp && hp < 1) [r1, g1, b1] = [c, x, 0]
  else if (1 <= hp && hp < 2) [r1, g1, b1] = [x, c, 0]
  else if (2 <= hp && hp < 3) [r1, g1, b1] = [0, c, x]
  else if (3 <= hp && hp < 4) [r1, g1, b1] = [0, x, c]
  else if (4 <= hp && hp < 5) [r1, g1, b1] = [x, 0, c]
  else if (5 <= hp && hp < 6) [r1, g1, b1] = [c, 0, x]
  const m = l - c / 2
  return [
    clamp255((r1 + m) * 255),
    clamp255((g1 + m) * 255),
    clamp255((b1 + m) * 255)
  ]
}

function relativeLuminance(r: number, g: number, b: number): number {
  const toLin = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  const R = toLin(r)
  const G = toLin(g)
  const B = toLin(b)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function contrastRatio(L1: number, L2: number): number {
  const [a, b] = L1 > L2 ? [L1, L2] : [L2, L1]
  return (a + 0.05) / (b + 0.05)
}
