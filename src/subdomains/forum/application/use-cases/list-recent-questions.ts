import { QuestionsRepository } from '@/subdomains/forum/application/repositories/questions.repository'
import { Question } from '../../enterprise/entities/question'
import { Either, right } from '@/core/either'

interface IListRecentQuestionsUseCaseRequest {
  page: number
}

type IListRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[]
  }
>

export class ListRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}
  async execute({
    page,
  }: IListRecentQuestionsUseCaseRequest): Promise<IListRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({
      page,
    })

    return right({
      questions,
    })
  }
}
