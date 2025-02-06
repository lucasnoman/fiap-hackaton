import { Message } from '../value-objects/message-value-object'

export interface MessageQueuePort {
  publish<T>(queue: string, message: Message<T>): Promise<void>
  subscribe<T>(
    queue: string,
    callback: (message: Message<T>) => void,
  ): Promise<void>
}
