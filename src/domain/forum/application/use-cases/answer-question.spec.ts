import { regexForUUIDTesting } from 'test/utils/regex-for-uuid-testing'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase
describe('Answer Question', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })
  it('should create an answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      instructorId: '2',
      content: 'test answer',
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(regexForUUIDTesting(result.value?.answer.id.toString())).toBe(true)
    expect(result.value?.answer.content).toEqual('test answer')
    expect(inMemoryAnswersRepository.items[0].id).toBe(result.value?.answer.id)
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
      ],
    )
  })
})
