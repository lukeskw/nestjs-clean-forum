import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments.repository'
import { ListQuestionCommentsUseCase } from './list-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comments'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: ListQuestionCommentsUseCase

describe('List Recent Questions Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new ListQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to list question comment', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityID('question-1'),
      }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.questionComments).toHaveLength(3)
    result.value?.questionComments.forEach((questionComment) => {
      expect(questionComment.questionId).toBeInstanceOf(UniqueEntityID)
    })
  })

  it('should be able to list the paginated question comment', async () => {
    for (let i = 1; i <= 25; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.questionComments).toHaveLength(5)
    result.value?.questionComments.forEach((questionComment) => {
      expect(questionComment.questionId).toBeInstanceOf(UniqueEntityID)
    })
  })
})
