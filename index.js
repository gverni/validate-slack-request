const crypto = require('crypto')
const querystring = require('querystring')

/**
 * Validate incoming Slack request
 *
 * @param {string} slackAppSigningSecret - Slack application signing secret
 * @param {object} httpReq - Express request object
 * @param {boolean} [logging=false] - Enable logging to console
 *
 * @returns {boolean} Result of vlaidation
 */
function validateSlackRequest (slackAppSigningSecret, httpReq, logging) {
  logging = logging || false
  const xSlackRequestTimeStamp = httpReq.get('X-Slack-Request-Timestamp')
  const SlackSignature = httpReq.get('X-Slack-Signature')
  const bodyPayload = querystring.stringify(httpReq.body)
  if (!(xSlackRequestTimeStamp && SlackSignature && bodyPayload)) {
    return false
  }
  const baseString = 'v0:' + xSlackRequestTimeStamp + ':' + bodyPayload
  const hash = 'v0=' + crypto.createHmac('sha256', slackAppSigningSecret)
       .update(baseString)
       .digest('hex')

  if (logging) {
    console.log('Slack verifcation:\n Request body: ' + querystring.stringify(httpReq.body) + '\n Calculated Hash: ' + hash + '\n Slack-Signature: ' + SlackSignature)
  }
  return (SlackSignature === hash)
}

module.exports = validateSlackRequest
