import checkEnv from './index'

test('Empty options', () => {
  expect(() => checkEnv({})).not.toThrow()
})

test('A single required env is missing', () => {
  const input = {
    required: 'FOO'
  }
  console.error = jest.fn()
  expect(() => checkEnv(input)).toThrowError()
  expect(console.error).toHaveBeenCalledTimes(1)
})

test('All required envs are missing', () => {
  const input = {
    required: ['FOO', 'BAR']
  }
  console.error = jest.fn()
  expect(() => checkEnv(input)).toThrowError()
  expect(console.error).toHaveBeenCalledTimes(2)
})

test('Some required env are missing', () => {
  const input = {
    required: ['FOO', 'BAR']
  }
  process.env.FOO = 'foo'
  console.error = jest.fn()
  expect(() => checkEnv(input)).toThrowError()
  expect(console.error).toHaveBeenCalledTimes(1)
})

test('All required envs are available', () => {
  const input = {
    required: ['FOO', 'BAR']
  }
  process.env.FOO = 'foo'
  process.env.BAR = 'bar'
  console.error = jest.fn()
  expect(() => checkEnv(input)).not.toThrowError()
  expect(console.error).not.toHaveBeenCalled()
})
