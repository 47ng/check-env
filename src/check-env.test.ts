import checkEnv, {
  CheckEnvInput,
  MissingEnvironmentVariableError
} from './index'

test('Empty options', () => {
  console.error = jest.fn()
  console.warn = jest.fn()
  expect(() => checkEnv({})).not.toThrow()
  expect(console.error).not.toHaveBeenCalled()
  expect(console.warn).not.toHaveBeenCalled()
})

test('A single required env is missing', () => {
  const input = {
    required: 'foo'
  }
  const env = {}
  console.error = jest.fn()
  console.warn = jest.fn()
  expect(() => checkEnv(input, env)).toThrowError()
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.warn).not.toHaveBeenCalled()
})

test('All required envs are missing', () => {
  const input = {
    required: ['foo', 'bar']
  }
  const env = {}
  console.error = jest.fn()
  console.warn = jest.fn()
  expect(() => checkEnv(input, env)).toThrowError()
  expect(console.error).toHaveBeenCalledTimes(2)
  expect(console.warn).not.toHaveBeenCalled()
})

test('Some required env are missing', () => {
  const input = {
    required: ['foo', 'bar']
  }
  const env = {
    foo: 'foo'
  }
  console.error = jest.fn()
  console.warn = jest.fn()
  expect(() => checkEnv(input, env)).toThrowError()
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.warn).not.toHaveBeenCalled()
})

test('All required envs are available', () => {
  const input = {
    required: ['foo', 'bar']
  }
  const env = {
    foo: 'foo',
    bar: 'bar'
  }
  console.error = jest.fn()
  console.warn = jest.fn()
  checkEnv(input, env)
  expect(console.error).not.toHaveBeenCalled()
  expect(console.warn).not.toHaveBeenCalled()
})

// --

test('Error message type', () => {
  const input = {
    required: 'foo'
  }
  const env = {}
  expect(() => checkEnv(input, env)).toThrowError(
    MissingEnvironmentVariableError
  )
})

test('Error message contains name of missing variable', () => {
  const input = {
    required: 'foo',
    optional: 'bar'
  }
  const env = {}
  try {
    const run = () => checkEnv(input, env)
    run()
    expect(run).not.toHaveReturned() // Should throw
  } catch (error) {
    // Only missing required variables are shown in the message string
    expect(error.message).toMatch('foo')

    // Details are available in the `missing` property of the error object:
    expect(error.missing).toEqual({
      // `required` and `optional` will always be arrays
      required: ['foo'],
      optional: ['bar']
    })
  }
})

test('Error message contains name of missing variables', () => {
  const input = {
    required: ['foo', 'bar'],
    optional: ['egg', 'spam']
  }
  const env = {}
  try {
    const run = () => checkEnv(input, env)
    run()
    expect(run).not.toHaveReturned() // Should throw
  } catch (error) {
    expect(error.message).toMatch('foo, bar')
    expect(error.missing).toEqual({
      required: ['foo', 'bar'],
      optional: ['egg', 'spam']
    })
  }
})

// --

test('No throw', () => {
  const input = {
    required: ['foo', 'bar'],
    noThrow: true
  }
  const env = {}
  console.error = jest.fn()
  console.warn = jest.fn()
  checkEnv(input, env)
  expect(console.error).toHaveBeenCalledTimes(2)
  expect(console.warn).not.toHaveBeenCalled()
})

// --

test('It returns the missing variables', () => {
  const input = {
    required: ['foo', 'bar'],
    optional: ['egg', 'spam'],
    noThrow: true
  }
  const env = {}
  console.error = jest.fn()
  console.warn = jest.fn()
  const received = checkEnv(input, env)
  expect(received.required).toEqual(['foo', 'bar'])
  expect(received.optional).toEqual(['egg', 'spam'])
})

// --

test('Custom logging methods', () => {
  const input: CheckEnvInput = {
    required: ['foo', 'bar'],
    optional: ['egg', 'spam'],
    logError: jest.fn(),
    logWarning: jest.fn(),
    noThrow: true
  }
  const env = {}
  console.error = jest.fn()
  console.warn = jest.fn()
  checkEnv(input, env)
  expect(console.error).not.toHaveBeenCalled()
  expect(console.warn).not.toHaveBeenCalled()
  expect(input.logError).toHaveBeenCalledTimes(2)
  expect(input.logWarning).toHaveBeenCalledTimes(2)
})
