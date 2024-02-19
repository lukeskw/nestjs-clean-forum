import { ListQuestionAnswersUseCase } from './list-question-answers'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ListQuestionAnswersUseCase

describe('List Recent Questions', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new ListQuestionAnswersUseCase(inMemoryAnswersRepository)
  })

  it('should be able to list question answers', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const response = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    if (response.isRight()) {
      const { answers } = response.value
      expect(answers).toHaveLength(3)
      answers.forEach((answer) => {
        expect(answer.questionId).toBeInstanceOf(UniqueEntityID)
      })
    }
  })

  it('should be able to list the paginated question answers', async () => {
    for (let i = 1; i <= 25; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const response = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    if (response.isRight()) {
      const { answers } = response.value

      expect(answers).toHaveLength(5)
      answers.forEach((answer) => {
        expect(answer.questionId).toBeInstanceOf(UniqueEntityID)
      })
    }
  })
})
