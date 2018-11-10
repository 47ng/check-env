import chalk from 'chalk'

type Envs = string | string[]

interface CheckEnvInput {
  required?: Envs
  optional?: Envs
}

// --

const testEnv = name => process.env[name] !== undefined

const displayError = name => {
  console.error(chalk.red(`❌ Missing required environment variable ${name}`))
}

const displayWarning = name => {
  console.warn(chalk.yellow(`⚠️ Environment variable ${name} is not set`))
}

const throwError = () => {
  throw new Error('Some environment variables are missing')
}

// --

const checkEnv = ({ required, optional }: CheckEnvInput) => {
  if (!required && !optional) {
    return
  }

  if (required) {
    if (typeof required === 'string') {
      if (!testEnv(required)) {
        displayError(required)
        throwError()
      }
    } else {
      let pass = true
      required.forEach(env => {
        if (!testEnv(env)) {
          displayError(env)
          pass = false
        }
      })
      if (!pass) {
        throwError()
      }
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
}

export default checkEnv
