import chalk from 'chalk'

type Envs = string | string[]

export interface CheckEnvInput {
  required?: Envs
  optional?: Envs
  noThrow?: boolean
}

// --

const testEnv = (name: string) => !!process.env[name]

const displayError = (name: string) => {
  console.error(
    chalk.redBright(`❌  Missing required environment variable ${name}`)
  )
}

const displayWarning = (name: string) => {
  console.warn(chalk.yellow(`⚠️  Environment variable ${name} is not set`))
}

const throwError = () => {
  throw new Error('Some environment variables are missing')
}

// --

const checkEnv = ({ required, optional, noThrow }: CheckEnvInput) => {
  if (!required && !optional) {
    return
  }
  let _throw = false

  if (required) {
    if (typeof required === 'string') {
      if (!testEnv(required)) {
        displayError(required)
        _throw = true
      }
    } else {
      required.forEach(env => {
        if (!testEnv(env)) {
          displayError(env)
          _throw = true
        }
      })
    }
  }
  if (optional) {
    if (typeof optional === 'string') {
      if (!testEnv(optional)) {
        displayWarning(optional)
      }
    } else {
      optional.forEach(env => {
        if (!testEnv(env)) {
          displayWarning(env)
        }
      })
    }
  }
  if (_throw && !noThrow) {
    throwError()
  }
}

export default checkEnv
