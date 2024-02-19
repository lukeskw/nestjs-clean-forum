import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AnswerAttachmentList } from './answer-attachment-list'
import { AnswerCreatedEvent } from './events/answer-created-event'

export type AnswerProps = {
  authorId: UniqueEntityID
  questionId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
  attachments: AnswerAttachmentList
}
export class Answer extends AggregateRoot<AnswerProps> {
  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get summary() {
    return this.content.slice(0, 120).trimEnd().concat('...')
  }

  private setUpdatedAt() {
    this.props.updatedAt = new Date()
  }

  set attachments(attachments: AnswerAttachmentList) {
    this.props.attachments = attachments
    this.setUpdatedAt()
  }

  set content(content: string) {
    if (content === '') {
      throw new Error('Content cannot be empty')
    }
    this.props.content = content
    this.setUpdatedAt()
  }

  static create(
    props: Optional<AnswerProps, 'createdAt' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const answer = new Answer(
      {
        ...props,
        attachments: props.attachments ?? new AnswerAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewAnswer = !id

    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer))
    }

    return answer
  }
}
