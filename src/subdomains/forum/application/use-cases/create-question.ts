import { QuestionsRepository } from '@/subdomains/forum/application/repositories/questions.repository'
import { Question } from '../../enterprise/entities/question'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { Either, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface ICreateQuestionUseCaseRequest {
  studentId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type ICreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}
  async execute({
    content,
    studentId,
    title,
    attachmentsIds,
  }: ICreateQuestionUseCaseRequest): Promise<ICreateQuestionUseCaseResponse> {
    const question = Question.create({
      studentId: new UniqueEntityID(studentId),
      content,
      title,
    })

    const questionAttachments = attachmentsIds.map((id) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(id),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionsRepository.create(question)

    return right({
      question,
    })
  }
}
