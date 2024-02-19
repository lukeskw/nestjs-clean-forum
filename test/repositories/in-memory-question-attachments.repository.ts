import { QuestionAttachmentsRepository } from '@/subdomains/forum/application/repositories/question-attachments.repository'
import { QuestionAttachment } from '@/subdomains/forum/enterprise/entities/question-attachment'

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId,
    )

    return questionAttachments
  }

  async deleteManyByQuestionId(questionId: string) {
    const deletedItems = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    )

    this.items = deletedItems
  }
}
