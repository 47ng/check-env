import { checkEnv } from './index'

const env = {
  NODE_ENV: 'production',
  LOCAL_OVERRIDE_DISABLE_HTTPS: 'foo',
  INSECURE_COOKIES: 'bar'
}

checkEnv(
  {
    noThrow: true,
    // Will log an error and throw if any of these are missing:
    required: [
      'SOME_API_SECRET',
      'PRIVATE_TOKEN',
      'SOME_OTHER_IMPORTANT_THING',
      process.env.NODE_ENV === 'production' && 'ONLY_REQUIRED_IN_PRODUCTION'
      // ...
    ],

    // Will log an error and throw if any of these are set in production:
    unsafe: [
      'LOCAL_OVERRIDE_DISABLE_HTTPS',
      'INSECURE_COOKIES'
      // ...
    ]
  },
  env
)
