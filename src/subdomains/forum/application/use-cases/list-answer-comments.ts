import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments.repository'

interface IListAnswerCommentsUseCaseRequest {
  page: number
  answerId: string
}

type IListAnswerCommentsUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

export class ListAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}
  async execute({
    page,
    answerId,
  }: IListAnswerCommentsUseCaseRequest): Promise<IListAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        page,
      })

    return right({
      answerComments,
    })
  }
}
