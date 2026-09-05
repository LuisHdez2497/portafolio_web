export interface Publishable {
  published: boolean
}

export function onlyPublished<T extends Publishable>(items: T[]): T[] {
  return items.filter((item) => item.published)
}
