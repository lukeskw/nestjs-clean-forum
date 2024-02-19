import { regexForUUIDTesting } from 'test/utils/regex-for-uuid-testing'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })
  it('should get a question by its slug', async () => {
    const newQuestion = makeQuestion({
      title: 'Test Question',
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const response = await sut.execute({
      slug: 'test-question',
    })

    if (response.isRight()) {
      const question = response.value.question
      expect(regexForUUIDTesting(question.id.toString())).toBe(true)
      expect(question.slug.value).toEqual('test-question')
      expect(question.title).toEqual(newQuestion.title)
    }
  })
})
