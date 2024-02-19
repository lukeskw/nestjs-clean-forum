import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository'
import { Question } from '../../enterprise/entities/question'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface IGetQuestionBySlugUseCaseRequest {
  slug: string
}

type IGetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundException,
  {
    question: Question
  }
>

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}
  async execute({
    slug,
  }: IGetQuestionBySlugUseCaseRequest): Promise<IGetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      return left(new ResourceNotFoundException())
    }
    return right({
      question,
    })
  }
}
