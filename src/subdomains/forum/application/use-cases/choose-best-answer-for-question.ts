import { AnswersRepository } from '@/subdomains/forum/application/repositories/answers.repository'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions.repository'
import { Either, left, right } from '@/core/either'
import { UnauthorizedException } from '@/core/exceptions/exceptions/unauthorized.exception'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'

interface IChooseBestAnswerForQuestionUseCaseRequest {
  answerId: string
  authorId: string
}

type IChooseBestAnswerForQuestionUseCaseResponse = Either<
  UnauthorizedException | ResourceNotFoundException,
  {
    question: Question
  }
>

export class ChooseBestAnswerForQuestionUseCase {
  constructor(
    private questionRepository: QuestionsRepository,
    private answerRepository: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: IChooseBestAnswerForQuestionUseCaseRequest): Promise<IChooseBestAnswerForQuestionUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundException())
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return left(new ResourceNotFoundException())
    }

    if (authorId !== question.studentId.toString()) {
      return left(new UnauthorizedException())
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.save(question)

    return right({
      question,
    })
  }
}
