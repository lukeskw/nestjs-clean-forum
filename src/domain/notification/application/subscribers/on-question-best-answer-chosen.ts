import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { QuestionBestQuestionChosenEvent } from '@/domain/forum/enterprise/entities/events/question-best-answer-chosen'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnQuestionBestQuestionChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionBestAnswerNotification.bind(this),
      QuestionBestQuestionChosenEvent.name,
    )
  }

  private async sendNewQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestQuestionChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (!answer) {
      return
    }

    await this.sendNotification.execute({
      recipientId: answer.authorId.toString(),
      title: 'Your answer has been chosen',
      content: `The answer you send in "${question.title.substring(0, 20).concat('...')}" has been chosen by the author!`,
    })

    DomainEvents.markAggregateForDispatch(question)
  }
}
