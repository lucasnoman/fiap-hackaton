import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs'

// RUN THIS WORKFLOW
import { MessageQueuePort } from '@/core/application/queue/ports/message-queue-port'
import { Message } from '@/core/application/queue/value-objects/message-value-object'

export class SQSAdapter implements MessageQueuePort {
  private client: SQSClient

  constructor(region: string) {
    this.client = new SQSClient({ region })
  }

  async publish<T>(queue: string, message: Message<T>): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: queue,
      MessageBody: JSON.stringify(message),
    })

    await this.client.send(command)
  }

  async subscribe<T>(
    queue: string,
    callback: (message: Message<T>) => void,
  ): Promise<void> {
    const command = new ReceiveMessageCommand({
      QueueUrl: queue,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 10, // Long Polling para eficiência
      VisibilityTimeout: 30, // Tempo para processar antes de reencaminhar
    })

    const response = await this.client.send(command)

    if (response.Messages && response.Messages.length > 0) {
      for (const sqsMessage of response.Messages) {
        if (sqsMessage.Body) {
          const parsedMessage = JSON.parse(sqsMessage.Body) as Message<T>
          callback(parsedMessage)

          // Deletar a mensagem após o processamento
          if (sqsMessage.ReceiptHandle) {
            await this.client.send(
              new DeleteMessageCommand({
                QueueUrl: queue,
                ReceiptHandle: sqsMessage.ReceiptHandle,
              }),
            )
          }
        }
      }
    }
  }
}
