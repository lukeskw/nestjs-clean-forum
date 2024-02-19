import { UseCaseExpection } from '@/core/exceptions/use-case.exception'

export class CredentialsDoesNotMatchException
  extends Error
  implements UseCaseExpection
{
  constructor() {
    super('Credentials does not match')
  }
}
