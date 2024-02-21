import { Either, left, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments.repository'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'
import { UnauthorizedException } from '@/core/exceptions/exceptions/unauthorized.exception'
import { Injectable } from '@nestjs/common'

interface IDeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

type IDeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundException | UnauthorizedException,
  object
>

@Injectable()
export class DeleteAnswerCommentUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: IDeleteAnswerCommentUseCaseRequest): Promise<IDeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      return left(new ResourceNotFoundException())
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new UnauthorizedException())
    }
    await this.answerCommentsRepository.delete(answerComment)

    return right({})
  }
}
