import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments.repository'
import { ListAnswerCommentsUseCase } from './list-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comments'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: ListAnswerCommentsUseCase

describe('List Recent Answers Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new ListAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to list answer comment', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityID('answer-1'),
      }),
    )

    const response = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    if (response.isRight()) {
      const { answerComments } = response.value
      expect(answerComments).toHaveLength(3)
      answerComments.forEach((answerComment: AnswerComment) => {
        expect(answerComment.answerId).toBeInstanceOf(UniqueEntityID)
      })
    }
  })

  it('should be able to list the paginated answer comment', async () => {
    for (let i = 1; i <= 25; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
        }),
      )
    }

    const response = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    if (response.isRight()) {
      const { answerComments } = response.value
      expect(answerComments).toHaveLength(5)
      answerComments.forEach((answerComment: AnswerComment) => {
        expect(answerComment.answerId).toBeInstanceOf(UniqueEntityID)
      })
    }
  })
})
