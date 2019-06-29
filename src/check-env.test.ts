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
    required: 'KqtF_z3I5hiiCbv0'
  }
  console.error = jest.fn()
  console.warn = jest.fn()
  expect(() => checkEnv(input)).toThrowError()
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.warn).not.toHaveBeenCalled()
})

test('All required envs are missing', () => {
  const input = {
    required: ['hk75zuxi0m2scNXE', 'XZ5MB992w_3iTSKQ']
  }
  console.error = jest.fn()
  console.warn = jest.fn()
  expect(() => checkEnv(input)).toThrowError()
  expect(console.error).toHaveBeenCalledTimes(2)
  expect(console.warn).not.toHaveBeenCalled()
})

test('Some required env are missing', () => {
  const input = {
    required: ['BedDlgTTxxTdwE14', 'ZqCc1IrEcFP2yn_Y']
  }
  process.env.BedDlgTTxxTdwE14 = 'foo'
  console.error = jest.fn()
  console.warn = jest.fn()
  expect(() => checkEnv(input)).toThrowError()
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.warn).not.toHaveBeenCalled()
})

test('All required envs are available', () => {
  const input = {
    required: ['Lixn0eF52XWm31ie', 'GnyY_8f1ESMJcsop']
  }
  process.env.Lixn0eF52XWm31ie = 'foo'
  process.env.GnyY_8f1ESMJcsop = 'bar'
  console.error = jest.fn()
  console.warn = jest.fn()
  expect(() => checkEnv(input)).not.toThrowError()
  expect(console.error).not.toHaveBeenCalled()
  expect(console.warn).not.toHaveBeenCalled()
})

// --

test('Error message type', () => {
  const input = {
    required: 'EAgzgXu63HX7WbSL'
  }
  expect(() => checkEnv(input)).toThrowError(MissingEnvironmentVariableError)
})

test('Error message contains name of missing variable', () => {
  const input = {
    required: 'ZaxifpapEtM0XVeJ',
    optional: 'vtemZK65FQ3DtenN'
  }
  try {
    const run = () => checkEnv(input)
    run()
    expect(run).not.toHaveReturned() // Should throw
  } catch (error) {
    // Only missing required variables are shown in the message string
    expect(error.message).toMatch('ZaxifpapEtM0XVeJ')

    // Details are available in the `missing` property of the error object:
    expect(error.missing).toEqual({
      // `required` and `optional` will always be arrays
      required: ['ZaxifpapEtM0XVeJ'],
      optional: ['vtemZK65FQ3DtenN']
    })
  }
})

test('Error message contains name of missing variables', () => {
  const input = {
    required: ['T4iDS6avN9J5ytTv', 'kIHJ1Cypg4prebal'],
    optional: ['oPAAIPUPPdY53Wrw', 'zi2V1TsorroZJ4tJ']
  }
  try {
    const run = () => checkEnv(input)
    run()
    expect(run).not.toHaveReturned() // Should throw
  } catch (error) {
    expect(error.message).toMatch('T4iDS6avN9J5ytTv, kIHJ1Cypg4prebal')
    expect(error.missing).toEqual({
      required: ['T4iDS6avN9J5ytTv', 'kIHJ1Cypg4prebal'],
      optional: ['oPAAIPUPPdY53Wrw', 'zi2V1TsorroZJ4tJ']
    })
  }
})

// --

test('No throw', () => {
  const input = {
    required: ['HF3g9xYPpVfhbbPo', 'mM8xCEym9Pz66aDX'],
    noThrow: true
  }
  console.error = jest.fn()
  console.warn = jest.fn()
  expect(() => checkEnv(input)).not.toThrowError()
  expect(console.error).toHaveBeenCalledTimes(2)
  expect(console.warn).not.toHaveBeenCalled()
})

// --

test('Custom logging methods', () => {
  const input: CheckEnvInput = {
    required: ['zOVs80HV1qLSCfKs', 'VUpMkADjmmiftwwZ'],
    optional: ['xdIAi6pFuhUq8doM', 'j9gicBYSogTRDlpO'],
    logError: jest.fn(),
    logWarning: jest.fn(),
    noThrow: true
  }
  console.error = jest.fn()
  console.warn = jest.fn()
  expect(() => checkEnv(input)).not.toThrowError()
  expect(console.error).not.toHaveBeenCalled()
  expect(console.warn).not.toHaveBeenCalled()
  expect(input.logError).toHaveBeenCalledTimes(2)
  expect(input.logWarning).toHaveBeenCalledTimes(2)
})
