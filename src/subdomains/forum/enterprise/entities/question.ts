import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Slug } from './value-objects/slug'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestQuestionChosenEvent } from './events/question-best-answer-chosen'

export type QuestionProps = {
  studentId: UniqueEntityID
  bestAnswerId?: UniqueEntityID
  slug: Slug
  title: string
  attachments: QuestionAttachmentList
  content: string
  createdAt: Date
  updatedAt?: Date
}
export class Question extends AggregateRoot<QuestionProps> {
  get studentId() {
    return this.props.studentId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get slug() {
    return this.props.slug
  }

  get title() {
    return this.props.title
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

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'minutes') <= 30
  }

  get summary() {
    return this.content.slice(0, 120).trimEnd().concat('...')
  }

  private setUpdatedAt() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    if (content === '') {
      throw new Error('Content cannot be empty')
    }
    this.props.content = content
    this.setUpdatedAt()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)
    this.setUpdatedAt()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    if (bestAnswerId === undefined) {
      return
    }

    if (
      this.props.bestAnswerId === undefined ||
      !this.props.bestAnswerId.equals(bestAnswerId)
    ) {
      this.addDomainEvent(
        new QuestionBestQuestionChosenEvent(this, bestAnswerId),
      )
    }
    this.props.bestAnswerId = bestAnswerId
    this.setUpdatedAt()
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.setUpdatedAt()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments || new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }
}
