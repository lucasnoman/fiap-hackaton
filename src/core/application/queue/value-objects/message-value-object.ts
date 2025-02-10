export type Message<T = unknown> = {
  event: string
  timestamp: number
  payload: T
}
