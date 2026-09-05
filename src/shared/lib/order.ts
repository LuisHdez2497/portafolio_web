export function nextOrder<T extends { order: number }>(items: T[]): number {
  return items.length > 0 ? Math.max(...items.map((item) => item.order)) + 1 : 0
}
