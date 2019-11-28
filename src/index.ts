export interface CheckEnvInput {
  required?: string | string[]
  optional?: string | string[]
  noThrow?: boolean
  logError?: (name: string) => void
  logWarning?: (name: string) => void
}

// --

const testEnv = (name: string, env: NodeJS.ProcessEnv) => !!env[name]

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

const checkEnv = (
  {
    required,
    optional,
    noThrow,
    logError = displayError,
    logWarning = displayWarning
  }: CheckEnvInput,
  env: NodeJS.ProcessEnv = process.env
) => {
  if (!required && !optional) {
    return { required: [], optional: [] }
  }
  let missingReq = []
  let missingOpt = []

  if (required) {
    if (typeof required === 'string') {
      if (!testEnv(required, env)) {
        logError(required)
        missingReq.push(required)
      }
    } else {
      required.forEach(name => {
        if (!testEnv(name, env)) {
          logError(name)
          missingReq.push(name)
        }
      })
    }
  }
  if (optional) {
    if (typeof optional === 'string') {
      if (!testEnv(optional, env)) {
        logWarning(optional)
        missingOpt.push(optional)
      }
    } else {
      optional.forEach(name => {
        if (!testEnv(name, env)) {
          logWarning(name)
          missingOpt.push(name)
        }
      })
    }
  }
  if (missingReq.length > 0 && !noThrow) {
    throw new MissingEnvironmentVariableError(missingReq, missingOpt)
  }
  return {
    required: missingReq,
    optional: missingOpt
  }
}

export default checkEnv
