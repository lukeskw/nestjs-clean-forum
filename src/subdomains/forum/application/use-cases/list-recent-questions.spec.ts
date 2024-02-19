import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository'
import { makeQuestion } from 'test/factories/make-question'
import { ListRecentQuestionsUseCase } from './list-recent-questions'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: ListRecentQuestionsUseCase

describe('List Recent Questions', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new ListRecentQuestionsUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to list the recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 1, 20) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 1, 16) }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({ createdAt: new Date(2024, 1, 17) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.value?.questions).toHaveLength(3)
    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 1, 20) }),
      expect.objectContaining({ createdAt: new Date(2024, 1, 17) }),
      expect.objectContaining({ createdAt: new Date(2024, 1, 16) }),
    ])
  })

  it('should be able to list the paginated recent questions', async () => {
    for (let i = 1; i <= 25; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.value?.questions).toHaveLength(5)
  })
})
