import { UseCaseExpection } from '@/core/exceptions/use-case.exception'

export class ResourceNotFoundException
  extends Error
  implements UseCaseExpection
{
  constructor() {
    super('Resource not found')
  }
}
