import { Either, left, right } from '@/core/either'
import { QuestionCommentsRepository } from '../repositories/question-comments.repository'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'
import { UnauthorizedException } from '@/core/exceptions/exceptions/unauthorized.exception'
import { Injectable } from '@nestjs/common'

interface IDeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}

type IDeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundException | UnauthorizedException,
  object
>

@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: IDeleteQuestionCommentUseCaseRequest): Promise<IDeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      return left(new ResourceNotFoundException())
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new UnauthorizedException())
    }
    await this.questionCommentsRepository.delete(questionComment)

    return right({})
  }
}
