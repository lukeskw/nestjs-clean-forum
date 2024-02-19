import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments.repository'
import { DeleteQuestionCommentUseCase } from './delete-comment-on-question'
import { makeQuestionComment } from 'test/factories/make-question-comments'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { UnauthorizedException } from '@/core/exceptions/exceptions/unauthorized.exception'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Comment On Question', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should delete comment for question', async () => {
    const questionComment = makeQuestionComment()

    await inMemoryQuestionCommentsRepository.create(questionComment)

    await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: questionComment.authorId.toString(),
    })

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })
  it('should not be able to delete another user comment on question', async () => {
    const questionComment = makeQuestionComment({
      authorId: new UniqueEntityID('author-1'),
    })

    await inMemoryQuestionCommentsRepository.create(questionComment)

    const result = await sut.execute({
      questionCommentId: questionComment.id.toString(),
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedException)
  })
})
