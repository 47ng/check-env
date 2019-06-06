export interface CheckEnvInput {
  required?: string | string[]
  optional?: string | string[]
  noThrow?: boolean
  logError?: (name: string) => void
  logWarning?: (name: string) => void
}

// --

const testEnv = (name: string) => !!process.env[name]

const displayError = (name: string) => {
  console.error(`❌  Missing required environment variable ${name}`)
}

const displayWarning = (name: string) => {
  console.warn(`⚠️  Environment variable ${name} is not set`)
}

const throwError = () => {
  throw new Error('Some environment variables are missing')
}

// --

const checkEnv = ({
  required,
  optional,
  noThrow,
  logError = displayError,
  logWarning = displayWarning
}: CheckEnvInput) => {
  if (!required && !optional) {
    return
  }
  let _throw = false

  if (required) {
    if (typeof required === 'string') {
      if (!testEnv(required)) {
        logError(required)
        _throw = true
      }
    } else {
      required.forEach(env => {
        if (!testEnv(env)) {
          logError(env)
          _throw = true
        }
      })
    }
  }
  if (optional) {
    if (typeof optional === 'string') {
      if (!testEnv(optional)) {
        logWarning(optional)
      }
    } else {
      optional.forEach(env => {
        if (!testEnv(env)) {
          logWarning(env)
        }
      })
    }
  }
  if (_throw && !noThrow) {
    throwError()
  }
}

export default checkEnv
