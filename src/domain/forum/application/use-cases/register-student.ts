import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Student } from '../../enterprise/entities/student'
import { StudentsRepository } from '../repositories/students.repository'
import { HasherGenerator } from '../cryptography/hash-generator'
import { StudentAlreadyExistsException } from './exceptions/student-already-exists.exception'

interface IRegisterStudentUseCaseRequest {
  name: string
  email: string
  password: string
}

type IRegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsException,
  {
    student: Student
  }
>
@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HasherGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
  }: IRegisterStudentUseCaseRequest): Promise<IRegisterStudentUseCaseResponse> {
    const studentWithSameEmail =
      await this.studentsRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsException(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.studentsRepository.create(student)

    return right({
      student,
    })
  }
}
