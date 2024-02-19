import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/subdomains/forum/enterprise/entities/answer-comment'
import { faker } from '@faker-js/faker'

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  const answerComment = AnswerComment.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityID(),
      answerId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return answerComment
}
