import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications.repository'

export interface ISendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

export type ISendNotificationUseCaseResponse = Either<
  null,
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}
  async execute({
    content,
    recipientId,
    title,
  }: ISendNotificationUseCaseRequest): Promise<ISendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      content,
      title,
    })

    await this.notificationRepository.create(notification)

    return right({
      notification,
    })
  }
}
