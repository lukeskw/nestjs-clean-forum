import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Answer } from '@/subdomains/forum/enterprise/entities/answer'
import { AnswersRepository } from '@/subdomains/forum/application/repositories/answers.repository'
import { Either, right } from '@/core/either'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'

interface IAnswerQuestionUseCaseRequest {
  instructorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}

type IAnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}
  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: IAnswerQuestionUseCaseRequest): Promise<IAnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
    })

    const answerAttachments = attachmentsIds.map((id) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(id),
        answerId: answer.id,
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answerRepository.create(answer)

    return right({
      answer,
    })
  }
}
