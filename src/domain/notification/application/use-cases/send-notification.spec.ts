import { regexForUUIDTesting } from 'test/utils/regex-for-uuid-testing'
import { SendNotificationUseCase } from './send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications.repository'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })
  it('should send a notification', async () => {
    const result = await sut.execute({
      content: 'test notification',
      recipientId: '1',
      title: 'test notification',
    })

    expect(result.isRight()).toBe(true)
    expect(
      regexForUUIDTesting(result.value?.notification?.id?.toString()),
    ).toBe(true)
    expect(result.value?.notification.content).toEqual('test notification')
    expect(inMemoryNotificationsRepository.items[0].id).toBe(
      result.value?.notification.id,
    )
  })
})
