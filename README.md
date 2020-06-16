[![Build Status](https://travis-ci.org/gverni/validate-slack-request.svg?branch=master)](https://travis-ci.org/gverni/validate-slack-request) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# validate-slack-request

A simple module to validate Slack requests passed in via an **Express**, **Next**, or a **Node.js** `http` endpoint handler function, based off of the specification included in [the official Slack guide](https://api.slack.com/docs/verifying-requests-from-slack) for request validation.

**Disclaimer**: this module is not developed nor endorsed by Slack.

## Installation

```$ npm install validate-slack-request```

## Usage

```javascript
const validateSlackRequest = require('validateSlackRequest')

const signSecret = process.env.SLACK_SIGNING_SECRET

const endpointHandler = async (req, res) => { // ← your endpoint handler

  const isValid = await validateSlackRequest(signSecret, req)

  if (!isValid) {
    // for Express & Next.js
    res.status(403).send("Invalid Slack signing secret")
    return

    // for the Node.js http module
    res.statusCode = 403
    res.end("Invalid Slack signing secret")
    return
  }
}
```
### For Express Users
If using Express, you must register the `express.urlencoded` middleware with your Express app:
```javascript
const express = require("express")
const app = express()

app.use(express.urlencoded({ extended: true })) // ← register it with your app
```
See the [API section](#API) below to learn more about why we require the `express.urlencoded` middleware.

# API 

```validateSlackRequest (slackAppSigningSecret, httpReq, logging)```

* `slackAppSigningSecret`: the [Slack Signing Secret](https://api.slack.com/authentication/verifying-requests-from-slack#about) assigned to your [Slack app](https://api.slack.com/authentication/verifying-requests-from-slack#about). We recommend storing this in an environment variable for security (see [Usage](#Usage) above).

* `httpReq`: the `req` parameter passed to your endpoint handler function.
  - for **Express** users, this is a [Request](https://expressjs.com/en/api.html#req) object**
  - for **Node.js** `http` module users, this is an [IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) object
  - for **Next.js** users, this is a [_modified_ IncomingMessage](https://nextjs.org/docs/api-routes/introduction) object
  - _don't see your framework here?_ [Open an Issue 😃](https://github.com/gverni/validate-slack-request/issues/new/choose)

* `logging`: Optional parameter (default value is `false`) to print log information to console. 

\** **For Express Users:** Slack sends POST requests with an `application/x-www-form-urlencoded` encoded payload. **Express users** must register the `express.urlencoded` middleware with their Express app so that `validate-slack-request` can access that payload. See the sample code provided above under [Usage](#Usage) for guidance.


### Errors 

Following errors are thrown when invalid arguments are passed: 

* `Invalid slack app signing secret`: this error is thrown when the slack app signing secret (`slackAppSigningSecret`) is not a non-empty string. There is no check on actual validity of the app secret 
* `Invalid type for logging. Provided ..., expected boolean`: this error is thrown when `logging` argument is not a boolean 
