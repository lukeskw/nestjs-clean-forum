import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

export type CommentProps = {
  authorId: UniqueEntityID
  content: string
  createdAt: Date
  updatedAt?: Date
}
export abstract class Comment<
  Props extends CommentProps,
> extends Entity<Props> {
  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
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

  set content(content: string) {
    if (content === '') {
      throw new Error('Content cannot be empty')
    }
    this.props.content = content
    this.setUpdatedAt()
  }
}
