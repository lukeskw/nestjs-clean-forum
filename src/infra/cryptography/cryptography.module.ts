import { Module } from '@nestjs/common'
import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'
import { Encrypter } from '@/domain/forum/application/cryptography/encrypter'
import { HasherComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HasherGenerator } from '@/domain/forum/application/cryptography/hash-generator'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HasherComparer, useClass: BcryptHasher },
    { provide: HasherGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HasherComparer, HasherGenerator],
})
export class CryptographyModule {}
