import checkEnv, {
  CheckEnvInput,
  MissingEnvironmentVariableError,
  UnsafeEnvironmentVariableError
} from './index'

test('Empty options', () => {
  console.error = jest.fn()
  console.warn = jest.fn()
  expect(() => checkEnv({})).not.toThrow()
  expect(console.error).not.toHaveBeenCalled()
  expect(console.warn).not.toHaveBeenCalled()
})

test('A single required env is missing', () => {
  const input: CheckEnvInput = {
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
  const input: CheckEnvInput = {
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
  const input: CheckEnvInput = {
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

test('A single required envs is available', () => {
  const input: CheckEnvInput = {
    required: 'foo'
  }
  const env = {
    foo: 'foo'
  }
  console.error = jest.fn()
  console.warn = jest.fn()
  checkEnv(input, env)
  expect(console.error).not.toHaveBeenCalled()
  expect(console.warn).not.toHaveBeenCalled()
})

test('All required envs are available', () => {
  const input: CheckEnvInput = {
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
  const input: CheckEnvInput = {
    required: 'foo'
  }
  const env = {}
  expect(() => checkEnv(input, env)).toThrowError(
    MissingEnvironmentVariableError
  )
})

test('Error message contains name of missing variable', () => {
  const input: CheckEnvInput = {
    required: 'foo'
  }
  const env = {}
  try {
    const run = () => checkEnv(input, env)
    run()
    expect(run).not.toHaveReturned() // Should throw
  } catch (error) {
    expect(error).toBeInstanceOf(MissingEnvironmentVariableError)
    const e = error as MissingEnvironmentVariableError
    // Only missing required variables are shown in the message string
    expect(e.message).toMatch('foo')
    // Details are available in the `missing` property of the error object:
    expect(e.missing).toEqual(['foo'])
  }
})

test('Error message contains name of missing variables', () => {
  const input: CheckEnvInput = {
    required: ['foo', 'bar']
  }
  const env = {}
  try {
    const run = () => checkEnv(input, env)
    run()
    expect(run).not.toHaveReturned() // Should throw
  } catch (error) {
    expect(error).toBeInstanceOf(MissingEnvironmentVariableError)
    const e = error as MissingEnvironmentVariableError
    expect(e.message).toMatch('foo, bar')
    expect(e.missing).toEqual(['foo', 'bar'])
  }
})

// --

test('No throw', () => {
  const input: CheckEnvInput = {
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
  const input: CheckEnvInput = {
    required: ['foo', 'bar'],
    noThrow: true
  }
  const env = {}
  console.error = jest.fn()
  console.warn = jest.fn()
  const received = checkEnv(input, env)
  expect(received.required).toEqual(['foo', 'bar'])
})

// --

test('Custom logging methods', () => {
  const input: CheckEnvInput = {
    required: ['foo', 'bar'],
    unsafe: ['egg', 'spam'],
    logMissing: jest.fn(),
    logUnsafe: jest.fn(),
    noThrow: true
  }
  const env = {
    NODE_ENV: 'production',
    egg: 'egg',
    spam: 'spam'
  }
  console.error = jest.fn()
  console.warn = jest.fn()
  checkEnv(input, env)
  expect(console.error).not.toHaveBeenCalled()
  expect(input.logMissing).toHaveBeenCalledTimes(2)
  expect(input.logUnsafe).toHaveBeenCalledTimes(2)
})

test('Check if sensitive variable is set in production', () => {
  const input: CheckEnvInput = {
    unsafe: 'foo',
    logUnsafe: jest.fn(),
    noThrow: true
  }
  const env = {
    NODE_ENV: 'production',
    foo: 'foo'
  }
  const received = checkEnv(input, env)
  expect(input.logUnsafe).toHaveBeenCalledTimes(1)
  expect(received.unsafe).toEqual(['foo'])
})

test('Check if sensitive variables are set in production', () => {
  const input: CheckEnvInput = {
    unsafe: ['foo'],
    logUnsafe: jest.fn(),
    noThrow: true
  }
  const env = {
    NODE_ENV: 'production',
    foo: 'foo'
  }
  const received = checkEnv(input, env)
  expect(input.logUnsafe).toHaveBeenCalledTimes(1)
  expect(received.unsafe).toEqual(['foo'])
})

test('No sensitive variable is defined', () => {
  const input: CheckEnvInput = {
    unsafe: 'foo',
    logUnsafe: jest.fn(),
    noThrow: true
  }
  const env = {
    NODE_ENV: 'production'
  }
  const received = checkEnv(input, env)
  expect(input.logUnsafe).not.toHaveBeenCalled()
  expect(received.unsafe).toEqual([])
})

test('No sensitive variables are defined', () => {
  const input: CheckEnvInput = {
    unsafe: ['foo'],
    logUnsafe: jest.fn(),
    noThrow: true
  }
  const env = {
    NODE_ENV: 'production'
  }
  const received = checkEnv(input, env)
  expect(input.logUnsafe).not.toHaveBeenCalled()
  expect(received.unsafe).toEqual([])
})

test('Unsafe variables are logged to the console', () => {
  const input: CheckEnvInput = {
    unsafe: ['foo'],
    noThrow: true
  }
  const env = {
    NODE_ENV: 'production',
    foo: 'foo'
  }
  console.error = jest.fn()
  checkEnv(input, env)
  expect(console.error).toHaveBeenCalledTimes(1)
})

test('Unsafe variables throw an error', () => {
  const input: CheckEnvInput = {
    unsafe: ['foo']
  }
  const env = {
    NODE_ENV: 'production',
    foo: 'foo'
  }
  expect(() => checkEnv(input, env)).toThrowError(
    UnsafeEnvironmentVariableError
  )
})

test('falsy values are ignored', () => {
  const input: CheckEnvInput = {
    required: [
      false && 'false',
      null && 'null',
      undefined && 'undefined',
      0 && 'zero',
      NaN && 'NaN'
    ],
    unsafe: [
      false && 'false',
      null && 'null',
      undefined && 'undefined',
      0 && 'zero',
      NaN && 'NaN'
    ]
  }
  const env = {
    NODE_ENV: 'production'
  }
  expect(() => checkEnv(input, env)).not.toThrow()
})
