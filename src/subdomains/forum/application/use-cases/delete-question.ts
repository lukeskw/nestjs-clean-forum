import { QuestionsRepository } from '@/subdomains/forum/application/repositories/questions.repository'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'
import { UnauthorizedException } from '@/core/exceptions/exceptions/unauthorized.exception'
import { Either, left, right } from '@/core/either'

interface IDeleteQuestionUseCaseRequest {
  questionId: string
  studentId: string
}

type IDeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundException | UnauthorizedException,
  object
>

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}
  async execute({
    questionId,
    studentId,
  }: IDeleteQuestionUseCaseRequest): Promise<IDeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundException())
    }

    if (studentId !== question.studentId.toString()) {
      return left(new UnauthorizedException())
    }

    await this.questionsRepository.delete(question)

    return right({})
  }
}
