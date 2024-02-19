import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository'
import { EditQuestionUseCase } from './edit-question'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { UnauthorizedException } from '@/core/exceptions/exceptions/unauthorized.exception'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
    )
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionsAttachmentsRepository,
    )
  })

  it('should edit a question', async () => {
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
      questionId: newQuestion.id.toValue(),
      studentId: 'student-1',
      title: 'new title',
      content: 'new content',
      attachmentsIds: ['att-1', 'att-3'],
    })

    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('att-1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('att-3') }),
    ])

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'new title',
      content: 'new content',
    })
  })

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion(
      {
        studentId: new UniqueEntityID('student-2'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.toValue(),
      studentId: 'student-1',
      title: 'new title',
      content: 'new content',
      attachmentsIds: [],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedException)
  })
  it('should not be able to edit a non existing question', async () => {
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
      title: 'new title',
      content: 'new content',
      attachmentsIds: [],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundException)
  })
})
