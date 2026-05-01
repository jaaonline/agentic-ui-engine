import axios from 'axios'
import { generateUI } from '../lib/api'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const mockSchema = {
  id: 'test_schema',
  version: '1.0',
  layout: 'stack',
  components: [
    {
      type: 'button',
      id: 'btn_1',
      props: { label: 'Click me', variant: 'primary' }
    }
  ],
  interactions: []
}

describe('generateUI', () => {
  it('returns schema on successful API call', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { schema: mockSchema } })
    const result = await generateUI('make a button')
    expect(result).toEqual(mockSchema)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/generate'),
      { prompt: 'make a button' }
    )
  })

  it('throws error on failed API call', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'))
    await expect(generateUI('make a button')).rejects.toThrow('Network error')
  })
})