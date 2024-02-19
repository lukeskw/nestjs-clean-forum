import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository'
import { ChooseBestAnswerForQuestionUseCase } from './choose-best-answer-for-question'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers.repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UnauthorizedException } from '@/core/exceptions/exceptions/unauthorized.exception'
import { ResourceNotFoundException } from '@/core/exceptions/exceptions/resource-not-found.exception'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseBestAnswerForQuestionUseCase

describe('Choose Best Answer For Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new ChooseBestAnswerForQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should choose best answer for question', async () => {
    const question = makeQuestion()

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: question.studentId.toString(),
    })

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose best answer for a question from another user', async () => {
    const question = makeQuestion({
      studentId: new UniqueEntityID('student-2'),
    })

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerId: answer.id.toString(),
      authorId: 'student-1',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedException)
  })
  it('should not be able to choose best answer for a non existing answer', async () => {
    const question = makeQuestion({
      studentId: new UniqueEntityID('student-2'),
    })

    const answer = makeAnswer({
      questionId: question.id,
    })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    const result = await sut.execute({
      answerId: 'question-2',
      authorId: 'student-1',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundException)
  })
})
