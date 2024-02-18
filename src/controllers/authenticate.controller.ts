import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const AuthenticateSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticateBodySchema = z.infer<typeof AuthenticateSchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(AuthenticateSchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = AuthenticateSchema.parse(body)

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const isPasswordsValid = await compare(password, user.password)

    if (!isPasswordsValid) {
      throw new UnauthorizedException('User credentials do not match')
    }

    const accessToken = this.jwt.sign({
      sub: user.id,
    })

    return {
      access_token: accessToken,
    }
  }
}
