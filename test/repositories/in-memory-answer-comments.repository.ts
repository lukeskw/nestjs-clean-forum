import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/subdomains/forum/application/repositories/answer-comments.repository'
import { AnswerComment } from '@/subdomains/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = []

  async create(comment: AnswerComment) {
    this.items.push(comment)
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)

    if (!answerComment) {
      return null
    }
    return answerComment
  }

  async delete(answerComment: AnswerComment) {
    const itemIdx = this.items.findIndex((item) => item.id === answerComment.id)

    this.items.splice(itemIdx, 1)
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }
}
