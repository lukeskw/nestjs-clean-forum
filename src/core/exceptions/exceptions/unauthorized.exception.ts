import { UseCaseExpection } from '@/core/exceptions/use-case.exception'

export class UnauthorizedException extends Error implements UseCaseExpection {
  constructor() {
    super('Unauthorized')
  }
}
