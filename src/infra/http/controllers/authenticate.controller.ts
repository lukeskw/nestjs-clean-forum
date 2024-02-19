import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { CredentialsDoesNotMatchException } from '@/domain/forum/application/use-cases/exceptions/credentials-does-not-match.exception'
import { Public } from '@/infra/auth/public'

const AuthenticateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticateBodySchema = z.infer<typeof AuthenticateSchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(AuthenticateSchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = AuthenticateSchema.parse(body)

    const result = await this.authenticateStudent.execute({ email, password })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CredentialsDoesNotMatchException:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
