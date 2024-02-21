import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ChooseBestAnswerForQuestionUseCase } from '@/domain/forum/application/use-cases/choose-best-answer-for-question'

@Controller('/answers/:answerId/choose-as-best')
export class ChooseBestAnswerForQuestionController {
  constructor(
    private chooseBestAnswerForQuestion: ChooseBestAnswerForQuestionUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { sub: userId } = user

    const result = await this.chooseBestAnswerForQuestion.execute({
      authorId: userId,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
