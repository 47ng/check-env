import checkEnv from './index'

test('Empty options', () => {
  expect(() => checkEnv({})).not.toThrow()
})

test('A single required env is missing', () => {
  const input = {
    required: 'KqtF_z3I5hiiCbv0'
  }
  console.error = jest.fn()
  expect(() => checkEnv(input)).toThrowError()
  expect(console.error).toHaveBeenCalledTimes(1)
})

test('All required envs are missing', () => {
  const input = {
    required: ['hk75zuxi0m2scNXE', 'XZ5MB992w_3iTSKQ']
  }
  console.error = jest.fn()
  expect(() => checkEnv(input)).toThrowError()
  expect(console.error).toHaveBeenCalledTimes(2)
})

test('Some required env are missing', () => {
  const input = {
    required: ['BedDlgTTxxTdwE14', 'ZqCc1IrEcFP2yn_Y']
  }
  process.env.BedDlgTTxxTdwE14 = 'foo'
  console.error = jest.fn()
  expect(() => checkEnv(input)).toThrowError()
  expect(console.error).toHaveBeenCalledTimes(1)
})

test('All required envs are available', () => {
  const input = {
    required: ['Lixn0eF52XWm31ie', 'GnyY_8f1ESMJcsop']
  }
  process.env.Lixn0eF52XWm31ie = 'foo'
  process.env.GnyY_8f1ESMJcsop = 'bar'
  console.error = jest.fn()
  expect(() => checkEnv(input)).not.toThrowError()
  expect(console.error).not.toHaveBeenCalled()
})
