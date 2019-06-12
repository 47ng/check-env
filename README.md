# `check-env`

Check that the critical environment variables are set for your app.

## Installation

```
yarn add @47ng/check-env
```

## Usage

```js
import checkEnv from '@47ng/check-env'

checkEnv({
  required: [
    'SOME_API_SECRET',
    'PRIVATE_TOKEN',
    'SOME_OTHER_IMPORTANT_THING'
    // ...
  ],
  optional: [
    'ENABLE_LOGGING',
    'OPTIONAL_SERVICE_SECRET'
    //...
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

You can override the default logging methods with `logError` and `logWarning`.

Example using [Pino](https://github.com/pinojs/pino):

```js
const logger = require('pino')()

checkEnv({
  logError: name => logger.error(`Missing required environment variable ${name}`),
  logWarning: name => logger.warn(`Missing optional environment variable ${name}`),
  ...
})
```
