import { UseCaseExpection } from '@/core/exceptions/use-case.exception'

export class StudentAlreadyExistsException
  extends Error
  implements UseCaseExpection
{
  constructor(identifier: string) {
    super(`Student "${identifier}" address already exists`)
  }
}
