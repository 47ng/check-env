# `check-env`

Check that the critical environment variables are set for your app.

```
yarn add @47ng/check-env
```

Early in your app startup code:

```js
import checkEnv from 'check-env'

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
an error:
!["CLI output"](output.png)

You can choose to skip throwing an error with the `noThrow` option:

```js
checkEnv({
  noThrow: true,
  ...
})
```
