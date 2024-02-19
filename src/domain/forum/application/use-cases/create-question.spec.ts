import { regexForUUIDTesting } from 'test/utils/regex-for-uuid-testing'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments.repository'

let inMemoryQuestionsAttachmentsRepository =
  new InMemoryQuestionAttachmentsRepository()
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryQuestionsAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionsAttachmentsRepository,
    )
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })
  it('should create a question', async () => {
    const result = await sut.execute({
      content: 'test question',
      studentId: '1',
      title: 'test question',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(regexForUUIDTesting(result.value?.question?.id?.toString())).toBe(
      true,
    )
    expect(result.value?.question.content).toEqual('test question')
    expect(inMemoryQuestionsRepository.items[0].id).toBe(
      result.value?.question.id,
    )

    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
