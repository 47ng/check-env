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

// --

export class MissingEnvironmentVariableError extends Error {
  readonly missing: {
    required: string[]
    optional: string[]
  }

  constructor(missingRequired: string[], missingOptional: string[]) {
    const joined = missingRequired.join(', ')
    super(`Some required environment variables are missing: ${joined}`)
    this.missing = {
      required: missingRequired,
      optional: missingOptional
    }
  }
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
  let missingReq = []
  let missingOpt = []

  if (required) {
    if (typeof required === 'string') {
      if (!testEnv(required)) {
        logError(required)
        missingReq.push(required)
      }
    } else {
      required.forEach(env => {
        if (!testEnv(env)) {
          logError(env)
          missingReq.push(env)
        }
      })
    }
  }
  if (optional) {
    if (typeof optional === 'string') {
      if (!testEnv(optional)) {
        logWarning(optional)
        missingOpt.push(optional)
      }
    } else {
      optional.forEach(env => {
        if (!testEnv(env)) {
          logWarning(env)
          missingOpt.push(env)
        }
      })
    }
  }
  if (missingReq.length > 0 && !noThrow) {
    throw new MissingEnvironmentVariableError(missingReq, missingOpt)
  }
}

export default checkEnv