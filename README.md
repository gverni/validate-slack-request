[![Build Status](https://travis-ci.org/gverni/validate-slack-request.svg?branch=master)](https://travis-ci.org/gverni/validate-slack-request) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# validate-slack-request

A simple module to validate Slack requests based on [this article](https://api.slack.com/docs/verifying-requests-from-slack). The module requires a valid expressJS request object as defined [here](https://expressjs.com/en/api.html#reqhttps://expressjs.com/en/api.html#req). See more about that in the [API section](API)

Disclaimer: this module is not developed nor endorsed by Slack 

# Installation 

To install use: 

```$ npm install validate-slack-request```


# API 

```validateSlackRequest (slackAppSigningSecret, httpReq, logging)```

Where:
* `slackAppSigningSecret`: this is the Slack Signing Secret assigned to the app when created. This can be accessed from the Slack app settings under "Basic Information". Look for "Signing secret". 
* `httpReq`: Express request object as defined [here](https://expressjs.com/en/api.html#reqhttps://expressjs.com/en/api.html#req). If this module is used outside Express, make sure that `httpreq` exposes the following: 
  * `get()`: used to retrieve HTTP request headers (e.g. `httpReq.get('Content-Type')`)
  * `.body` : JSON object representing the body of the HTTP POST request.
* `logging`: Optional variable (deault `false`) to print log information to console. 

# Example

In express it can be added to your route using: 

```
const slackValidateRequest = require('validate-slack-request')

(...) 

router.post('/', function (req, res, next) {
  if (validateSlackRequest(req, process.env.SLACK_APP_SIGNING_SECRET)) {
    // Valid request - Send appropriate response 
    res.send(...)
  }
```
    
Above example assumes that the signing secret is stored in environment variable `SLACK_APP_SIGNING_SECRET` (hardcoding of this variable is not advised) 
