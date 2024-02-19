import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository'
import { DeleteQuestionUseCase } from './delete-question'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'
import { UnauthorizedException } from '@/core/exceptions/exceptions/unauthorized.exception'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
    )
    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        studentId: new UniqueEntityID('student-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionsAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('att-1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('att-2'),
      }),
    )

    await sut.execute({
      questionId: 'question-1',
      studentId: 'student-1',
    })

    expect(inMemoryQuestionsRepository.items).toHaveLength(0)
    expect(inMemoryQuestionsAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        studentId: new UniqueEntityID('student-2'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-1',
      studentId: 'student-1',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedException)
  })
  it('should not be able to delete a non existing question', async () => {
    const newQuestion = makeQuestion(
      {
        studentId: new UniqueEntityID('student-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: 'question-2',
      studentId: 'student-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundException)
  })
})
