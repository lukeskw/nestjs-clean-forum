import { QuestionsRepository } from '@/subdomains/forum/application/repositories/questions.repository'
import { Question } from '../../enterprise/entities/question'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'
import { UnauthorizedException } from '@/core/exceptions/exceptions/unauthorized.exception'
import { Either, left, right } from '@/core/either'
import { QuestionAttachmentsRepository } from '../repositories/question-attachments.repository'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'

interface IEditQuestionUseCaseRequest {
  studentId: string
  questionId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type IEditQuestionUseCaseResponse = Either<
  ResourceNotFoundException | UnauthorizedException,
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    studentId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: IEditQuestionUseCaseRequest): Promise<IEditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundException())
    }

    if (studentId !== question.studentId.toString()) {
      return left(new UnauthorizedException())
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    const questionAttachments = attachmentsIds.map((id) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(id),
        questionId: question.id,
      })
    })

    questionAttachmentList.update(questionAttachments)

    question.attachments = questionAttachmentList

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)

    return right({
      question,
    })
  }
}
