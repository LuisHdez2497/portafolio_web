export type MoveDirection = 'up' | 'down'

export function useReorder<T extends { id: string; order: number }>(
  items: T[],
  update: (input: { id: string; changes: { order: number } }) => void,
): (id: string, direction: MoveDirection) => void {
  return (id, direction) => {
    const index = items.findIndex((item) => item.id === id)
    const target = direction === 'up' ? index - 1 : index + 1
    if (index < 0 || target < 0 || target >= items.length) return
    const current = items[index]
    const swap = items[target]
    if (!current || !swap) return
    update({ id: current.id, changes: { order: swap.order } })
    update({ id: swap.id, changes: { order: current.order } })
  }
}
