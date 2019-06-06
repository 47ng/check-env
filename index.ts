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

const throwError = (missing: string[]) => {
  const message = `Some required environment variables are missing: ${missing.join(
    ', '
  )}`
  throw new Error(message)
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
  let missing = []

  if (required) {
    if (typeof required === 'string') {
      if (!testEnv(required)) {
        logError(required)
        missing.push(required)
      }
    } else {
      required.forEach(env => {
        if (!testEnv(env)) {
          logError(env)
          missing.push(env)
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
  if (missing.length > 0 && !noThrow) {
    throwError(missing)
  }
}

export default checkEnv
