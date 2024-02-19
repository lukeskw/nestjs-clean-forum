import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/subdomains/forum/enterprise/entities/question'
import { faker } from '@faker-js/faker'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  const question = Question.create(
    {
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      studentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return question
}
