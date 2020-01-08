export interface CheckEnvInput {
  required?: string | string[]
  optional?: string | string[]
  unsafeForProduction?: string | string[]
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
    unsafeForProduction,
    noThrow,
    logError = displayError,
    logWarning = displayWarning
  }: CheckEnvInput,
  env: NodeJS.ProcessEnv = process.env
) => {
  let missingReq = []
  let missingOpt = []
  let unsafeProd = []

  if (required) {
    const name = required
    if (typeof name === 'string') {
      if (!testEnv(name, env)) {
        logError(name)
        missingReq.push(name)
      }
    } else {
      name.forEach(name => {
        if (!testEnv(name, env)) {
          logError(name)
          missingReq.push(name)
        }
      })
    }
  }
  if (optional) {
    const name = optional
    if (typeof name === 'string') {
      if (!testEnv(name, env)) {
        logWarning(name)
        missingOpt.push(name)
      }
    } else {
      name.forEach(name => {
        if (!testEnv(name, env)) {
          logWarning(name)
          missingOpt.push(name)
        }
      })
    }
  }

  if (env.NODE_ENV === 'production' && unsafeForProduction) {
    const name = unsafeForProduction
    if (typeof name === 'string') {
      if (testEnv(name, env)) {
        logWarning(name)
        unsafeProd.push(name)
      }
    } else {
      name.forEach(name => {
        if (testEnv(name, env)) {
          logWarning(name)
          unsafeProd.push(name)
        }
      })
    }
  }

  if (missingReq.length > 0 && !noThrow) {
    throw new MissingEnvironmentVariableError(missingReq, missingOpt)
  }
  return {
    required: missingReq,
    optional: missingOpt,
    unsafeForProduction: unsafeProd
  }
}

export default checkEnv
