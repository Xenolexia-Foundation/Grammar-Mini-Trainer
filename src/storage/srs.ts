/**
 * Spaced repetition: per-item history and weighted selection.
 * Prefer items that were wrong last time or not seen recently.
 */

const KEY_ITEM_HISTORY = 'grammar-trainer-item-history'

interface ItemRecord {
  lastSeen: string // ISO date
  correct: boolean
}

function readHistory(): Record<string, ItemRecord> {
  try {
    const raw = localStorage.getItem(KEY_ITEM_HISTORY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, ItemRecord>) : {}
  } catch {
    return {}
  }
}

function writeHistory(h: Record<string, ItemRecord>): void {
  try {
    localStorage.setItem(KEY_ITEM_HISTORY, JSON.stringify(h))
  } catch {
    // ignore
  }
}

function storageKey(conceptId: string, itemKey: string): string {
  return `${conceptId}:${itemKey}`
}

export function recordItemResult(conceptId: string, itemKey: string, correct: boolean): void {
  const h = readHistory()
  h[storageKey(conceptId, itemKey)] = {
    lastSeen: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    correct,
  }
  writeHistory(h)
}

/**
 * Return an index into itemKeys that prefers: never seen > last wrong > seen long ago.
 * Uses weighted random: higher weight = more likely to be picked.
 */
export function getWeightedItemIndex(itemKeys: string[], conceptId: string): number {
  if (itemKeys.length === 0) return 0
  const h = readHistory()
  const now = new Date()

  const weights = itemKeys.map((key) => {
    const rec = h[storageKey(conceptId, key)]
    if (!rec) return 100 // never seen: high priority
    const daysSince = (now.getTime() - new Date(rec.lastSeen).getTime()) / (1000 * 60 * 60 * 24)
    if (!rec.correct) return 80 + Math.min(daysSince, 30) // wrong last: high, decay by time
    return 10 + Math.min(daysSince * 2, 40) // seen correct: lower, grow with time since
  })

  const total = weights.reduce((a, b) => a + b, 0)
  if (total <= 0) return Math.floor(Math.random() * itemKeys.length)
  let r = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return i
  }
  return weights.length - 1
}

export function clearItemHistory(): void {
  try {
    localStorage.removeItem(KEY_ITEM_HISTORY)
  } catch {
    // ignore
  }
}

export function getItemHistoryForExport(): Record<string, ItemRecord> {
  return readHistory()
}

export function setItemHistoryFromImport(data: Record<string, ItemRecord>): void {
  writeHistory(data)
}
