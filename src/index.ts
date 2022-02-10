type Falsy = false | undefined | null | 0

export interface CheckEnvInput {
  required?: string | Array<string | Falsy>
  unsafe?: string | Array<string | Falsy>
  noThrow?: boolean
  logMissing?: (name: string) => void
  logUnsafe?: (name: string) => void
}

// --

const testEnv = (name: string, env: NodeJS.ProcessEnv) => Boolean(env[name])

const displayMissing = (name: string) => {
  console.error(`❌  Missing required environment variable ${name}`)
}

const displayUnsafe = (name: string) => {
  console.error(
    `❌  Unsafe environment variable ${name} should not be set in production`
  )
}

// --

export class MissingEnvironmentVariableError extends Error {
  readonly missing: string[]

  constructor(envs: string[]) {
    const joined = envs.join(', ')
    super(`Some required environment variables are missing: ${joined}`)
    this.missing = envs
  }
}

export class UnsafeEnvironmentVariableError extends Error {
  readonly unsafe: string[]

  constructor(envs: string[]) {
    const joined = envs.join(', ')
    super(`Some unsafe environment variables are set in production: ${joined}`)
    this.unsafe = envs
  }
}

// --

const checkEnv = (
  {
    required,
    unsafe,
    noThrow,
    logMissing = displayMissing,
    logUnsafe = displayUnsafe
  }: CheckEnvInput,
  env: NodeJS.ProcessEnv = process.env
) => {
  let missingReq = []
  let unsafeProd = []

  if (required) {
    const name = required
    if (typeof name === 'string') {
      if (!testEnv(name, env)) {
        logMissing(name)
        missingReq.push(name)
      }
    } else {
      name.forEach(name => {
        if (!name) {
          return
        }
        if (!testEnv(name, env)) {
          logMissing(name)
          missingReq.push(name)
        }
      })
    }
  }

  if (env.NODE_ENV === 'production' && unsafe) {
    const name = unsafe
    if (typeof name === 'string') {
      if (testEnv(name, env)) {
        logUnsafe(name)
        unsafeProd.push(name)
      }
    } else {
      name.forEach(name => {
        if (!name) {
          return
        }
        if (testEnv(name, env)) {
          logUnsafe(name)
          unsafeProd.push(name)
        }
      })
    }
  }

  if (missingReq.length > 0 && !noThrow) {
    throw new MissingEnvironmentVariableError(missingReq)
  }
  if (unsafeProd.length > 0 && !noThrow) {
    throw new UnsafeEnvironmentVariableError(unsafeProd)
  }

  return {
    required: missingReq,
    unsafe: unsafeProd
  }
}

export default checkEnv
