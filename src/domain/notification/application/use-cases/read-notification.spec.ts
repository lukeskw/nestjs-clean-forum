import { regexForUUIDTesting } from 'test/utils/regex-for-uuid-testing'
import { ReadNotificationUseCase } from './read-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'
import { UnauthorizedException } from '@/core/exceptions/exceptions/unauthorized.exception'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })
  it('should read a notification', async () => {
    const notification = makeNotification()

    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    if (result.isRight()) {
      expect(result.isRight()).toBe(true)
      expect(regexForUUIDTesting(result.value.notification.id.toString())).toBe(
        true,
      )
      expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
        expect.any(Date),
      )
    }
  })

  it('should not be able to delete a notification from another user', async () => {
    const newNotification = makeNotification(
      {
        recipientId: new UniqueEntityID('recipient-2'),
      },
      new UniqueEntityID('notification-1'),
    )

    await inMemoryNotificationsRepository.create(newNotification)

    const result = await sut.execute({
      notificationId: 'notification-1',
      recipientId: 'recipient-1',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedException)
  })
  it('should not be able to delete a non existing notification', async () => {
    const newNotification = makeNotification(
      {
        recipientId: new UniqueEntityID('recipient-1'),
      },
      new UniqueEntityID('notification-1'),
    )

    await inMemoryNotificationsRepository.create(newNotification)

    const result = await sut.execute({
      notificationId: 'notification-2',
      recipientId: 'recipient-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundException)
  })
})
