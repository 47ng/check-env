# `check-env`

Check that the critical environment variables are set for your app,
and that you did not leave dangerous development overrides in production.

## Installation

```
yarn add @47ng/check-env
```

## Usage

```js
import checkEnv from '@47ng/check-env'

checkEnv({
  // Will log an error and throw if any of these are missing:
  required: [
    'SOME_API_SECRET',
    'PRIVATE_TOKEN',
    'SOME_OTHER_IMPORTANT_THING'
    // ...
  ],

  // Will log an error and throw if any of these are set in production:
  unsafe: [
    'LOCAL_OVERRIDE_DISABLE_HTTPS',
    'INSECURE_COOKIES'
    // ...
  ]
})
```

If some required environment variable are not set, it will tell you and throw
an error at the end:
!["CLI output"](output.png)

## Error handling

You can choose to skip throwing an error with the `noThrow` option:

```js
checkEnv({
  noThrow: true,
  ...
})
```

## Logging

By default, `check-env` uses `console.err` and `console.warn` with emoji.

You can override the default logging methods with `logMissing` and `logUnsafe`.

Example using [Pino](https://github.com/pinojs/pino):

```js
const logger = require('pino')()

checkEnv({
  logMissing: name => logger.error(`Missing required environment variable ${name}`),
  logUnsafe: name => logger.warn(`Unsafe environment variable ${name} set in production`),
  ...
})
```
