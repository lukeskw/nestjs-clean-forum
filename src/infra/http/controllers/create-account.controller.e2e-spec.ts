import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })
  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'Test Account',
      email: 'test@prisma.com',
      password: '123456',
    })

    expect(response.status).toBe(201)

    const isUserOnDatabase = await prisma.user.findFirstOrThrow({
      where: {
        email: response.body.email,
      },
    })

    expect(isUserOnDatabase).toBeTruthy()
  })
})
