import { NotificationsRepository } from '@/subdomains/notification/application/repositories/notifications.repository'
import { Notification } from '@/subdomains/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification) {
    const itemIdx = this.items.findIndex((item) => item.id === notification.id)

    this.items[itemIdx] = notification
  }

  async findById(id: string) {
    const notification = this.items.find((item) => item.id.toString() === id)

    if (!notification) {
      return null
    }
    return notification
  }
}
