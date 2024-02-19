import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/subdomains/notification/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      title: faker.lorem.sentence(5),
      content: faker.lorem.sentence(10),
      recipientId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return notification
}
