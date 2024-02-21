import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments.repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'
import { Injectable } from '@nestjs/common'

interface ICommentOnQuestionUseCaseRequest {
  studentId: string
  questionId: string
  content: string
}

type ICommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundException,
  {
    questionComment: QuestionComment
  }
>

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    content,
    studentId,
    questionId,
  }: ICommentOnQuestionUseCaseRequest): Promise<ICommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundException())
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(studentId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({
      questionComment,
    })
  }
}
