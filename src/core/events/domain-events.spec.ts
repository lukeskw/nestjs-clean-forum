import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/value-objects/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

import { vi } from 'vitest'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  // eslint-disable-next-line
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<unknown> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('Domain Events', () => {
  it('should dispatch and listen to events', () => {
    const callbackSpy = vi.fn()

    // registering subscriber (listening for the event "created answer")
    DomainEvents.register(() => {
      callbackSpy()
    }, CustomAggregateCreated.name)

    // listening to an answer but WITHOUT SAVING IT IN THE DB
    const aggregate = CustomAggregate.create()

    // assuring that the event was created WAS BUT NOT SENT
    expect(aggregate.domainEvents).toHaveLength(1)

    // saving answer on the database and with this, sending the event
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // subscriber listens to the event and do what it must do
    expect(callbackSpy).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})
