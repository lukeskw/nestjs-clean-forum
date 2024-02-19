import { Either, left, right } from './either'

function testEither(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(10)
  } else {
    return left('error')
  }
}

describe('Either Left or Right cases', () => {
  it('should create a success case', () => {
    const success = right('success')

    const successFunctionResult = testEither(true)

    expect(success.value).toEqual('success')
    expect(successFunctionResult.isRight()).toBe(true)
    expect(successFunctionResult.isLeft()).toBe(false)
  })
  it('should create an error result', () => {
    const error = left('error')

    const errorFunctionResult = testEither(false)

    expect(error.value).toEqual('error')
    expect(errorFunctionResult.isLeft()).toBe(true)
    expect(errorFunctionResult.isRight()).toBe(false)
  })
})
