import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '@/subdomains/forum/application/repositories/answers.repository'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'
import { UnauthorizedException } from '@/core/exceptions/exceptions/unauthorized.exception'

interface IDeleteAnswerUseCaseRequest {
  answerId: string
  authorId: string
}

type IDeleteAnswerUseCaseResponse = Either<
  UnauthorizedException | ResourceNotFoundException,
  object
>

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}
  async execute({
    answerId,
    authorId,
  }: IDeleteAnswerUseCaseRequest): Promise<IDeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundException())
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new UnauthorizedException())
    }

    await this.answersRepository.delete(answer)

    return right({})
  }
}
