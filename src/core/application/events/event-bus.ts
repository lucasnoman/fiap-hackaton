// src/core/application/events/event-bus.ts

export type EventHandler<T> = (event: T) => Promise<void> | void

export class EventBus {
  // A map of event names to an array of event handlers.
  private handlers: Map<string, EventHandler<unknown>[]> = new Map()

  /**
   * Register an event handler for a specific event name.
   *
   * @param eventName The unique name of the event.
   * @param handler A function that handles the event.
   */
  subscribe<T>(eventName: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, [])
    }
    this.handlers.get(eventName)?.push(handler as EventHandler<unknown>)
  }

  /**
   * Publishes an event to all subscribed handlers.
   *
   * @param event An event that contains an `event` property to indicate its type.
   */
  async publish<T extends { event: string }>(event: T): Promise<void> {
    const eventHandlers = this.handlers.get(event.event)
    if (eventHandlers) {
      for (const handler of eventHandlers) {
        await handler(event)
      }
    }
  }
}
