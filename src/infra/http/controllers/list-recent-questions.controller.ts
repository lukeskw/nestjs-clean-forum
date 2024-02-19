import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { ListRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/list-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type pageQueryParamSchema = z.infer<typeof pageQueryParamSchema>
const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class ListRecentQuestionsController {
  constructor(private listRecentQuestions: ListRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: pageQueryParamSchema) {
    const result = await this.listRecentQuestions.execute({
      page,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    const questions = result.value.questions

    return {
      questions: questions.map(QuestionPresenter.toHTTP),
    }
  }
}
