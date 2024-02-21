import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository'
import { Answer } from '../../enterprise/entities/answer'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface IListQuestionAnswersUseCaseRequest {
  page: number
  questionId: string
}

type IListQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

@Injectable()
export class ListQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}
  async execute({
    page,
    questionId,
  }: IListQuestionAnswersUseCaseRequest): Promise<IListQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    )

    return right({
      answers,
    })
  }
}
