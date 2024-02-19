import { Either, left, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications.repository'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'
import { UnauthorizedException } from '@/core/exceptions/exceptions/unauthorized.exception'

interface IReadNotificationUseCaseRequest {
  notificationId: string
  recipientId: string
}

type IReadNotificationUseCaseResponse = Either<
  ResourceNotFoundException | UnauthorizedException,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}
  async execute({
    notificationId,
    recipientId,
  }: IReadNotificationUseCaseRequest): Promise<IReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundException())
    }

    if (recipientId !== notification.recipientId.toString()) {
      return left(new UnauthorizedException())
    }

    notification.setRead()

    await this.notificationRepository.save(notification)

    return right({
      notification,
    })
  }
}
