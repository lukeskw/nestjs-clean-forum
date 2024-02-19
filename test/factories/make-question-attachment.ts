import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/subdomains/forum/enterprise/entities/question-attachment'
export function makeQuestionAttachment(
  override: Partial<QuestionAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const questionAttachment = QuestionAttachment.create(
    {
      questionId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return questionAttachment
}
