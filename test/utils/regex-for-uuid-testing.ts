export function regexForUUIDTesting(
  uuidForTesting: string | undefined,
): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidForTesting) {
    return false
  }
  const isRegexValid = uuidRegex.test(uuidForTesting)

  return isRegexValid
}
