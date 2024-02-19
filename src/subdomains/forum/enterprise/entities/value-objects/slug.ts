export class Slug {
  public value: string
  private constructor(value: string) {
    this.value = value
  }

  /**
   * Creates a new instance of slug with the specified value
   *
   * @param slug {string}
   */

  static create(slug: string) {
    return new Slug(slug)
  }

  /**
   * Receives a string and returns a normalized slug
   *
   * E.g: "Lorem Ipsum Dolor Amet" => "lorem-ipsum-dolor-amet"
   *
   * @param text {string}
   */

  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
