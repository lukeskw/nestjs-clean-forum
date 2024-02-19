import { AnswersRepository } from '@/subdomains/forum/application/repositories/answers.repository'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments.repository'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'
import { Either, left, right } from '@/core/either'

interface ICommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

type ICommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundException,
  {
    answerComment: AnswerComment
  }
>

export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    content,
    authorId,
    answerId,
  }: ICommentOnAnswerUseCaseRequest): Promise<ICommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundException())
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    })

    await this.answerCommentsRepository.create(answerComment)

    return right({
      answerComment,
    })
  }
}
