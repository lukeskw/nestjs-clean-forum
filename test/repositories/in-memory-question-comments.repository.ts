import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/subdomains/forum/application/repositories/question-comments.repository'
import { QuestionComment } from '@/subdomains/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = []

  async create(comment: QuestionComment) {
    this.items.push(comment)
  }

  async findById(id: string) {
    const questionComment = this.items.find((item) => item.id.toString() === id)

    if (!questionComment) {
      return null
    }
    return questionComment
  }

  async delete(questionComment: QuestionComment) {
    const itemIdx = this.items.findIndex(
      (item) => item.id === questionComment.id,
    )

    this.items.splice(itemIdx, 1)
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }
}
