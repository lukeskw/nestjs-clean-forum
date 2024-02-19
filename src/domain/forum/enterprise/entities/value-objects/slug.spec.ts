import { Slug } from './slug'

describe('Slug test', async () => {
  it('should create a formated slug', async () => {
    const slug = Slug.createFromText('this-is--à_TÉST___slug-')

    expect(slug.value).toEqual('this-is-a-test-slug')
  })
})
