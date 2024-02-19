import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StudentsRepository } from '../repositories/students.repository'
import { HasherComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { CredentialsDoesNotMatchException } from './exceptions/credentials-does-not-match.exception'
interface IAuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

type IAuthenticateStudentUseCaseResponse = Either<
  CredentialsDoesNotMatchException,
  {
    accessToken: string
  }
>
@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HasherComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: IAuthenticateStudentUseCaseRequest): Promise<IAuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new CredentialsDoesNotMatchException())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.password,
    )

    if (!isPasswordValid) {
      return left(new CredentialsDoesNotMatchException())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
