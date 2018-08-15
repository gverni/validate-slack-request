/* eslint-env mocha */

const slackValidateRequest = require('..')
var assert = require('assert')

// Test object. Simulate an express request object
var slackSigningSecret = '8f742231b10e8888abcd99yyyzzz85a5'

function getTestHttpRequest () {
  return {
    'X-Slack-Request-Timestamp': '1531420618',
    'body': {
      'token': 'xyzz0WbapA4vBCDEFasx0q6G',
      'team_id': 'T1DC2JH3J',
      'team_domain': 'testteamnow',
      'channel_id': 'G8PSS9T3V',
      'channel_name': 'foobar',
      'user_id': 'U2CERLKJA',
      'user_name': 'roadrunner',
      'command': '/webhook-collect',
      'text': '',
      'response_url': 'https://hooks.slack.com/commands/T1DC2JH3J/397700885554/96rGlfmibIGlgcZRskXaIFfN',
      'trigger_id': '398738663015.47445629121.803a0bc887a14d10d2c447fce8b6703c'
    },
    'X-Slack-Signature': 'v0=a2114d57b48eac39b9ad189dd8316235a7b4a8d21a10bd27519666489c69b503',
    get: function (element) {
      return this[element]
    }
  }
}

var testHttpRequest

describe('Slack incoming request test', function () {
  describe('Basic test', function () {
    it('should return true with test object', function () {
      assert.equal(slackValidateRequest(slackSigningSecret, getTestHttpRequest()), true)
    })
  })

  describe('Wrong signature', function () {
    it('should return false if the signature doesn\'t match', function () {
      testHttpRequest = getTestHttpRequest()
      testHttpRequest['X-Slack-Signature'] = 'v0=a2114d57b58eac39b9ad189dd8316235a7b4a8d21a10bd27519666489c69b503'
      assert.equal(slackValidateRequest(slackSigningSecret, testHttpRequest), false)
    })
  })

  describe('Wrong Signing Secret', function () {
    it('should return false if the signing secret is not the correct one', function () {
      var tmpSlackSigningSecret = '9f742231b10e8888abcd99yyyzzz85a5'
      assert.equal(slackValidateRequest(tmpSlackSigningSecret, getTestHttpRequest()), false)
    })
  })

  describe('Wrong Timestamp', function () {
    it('should return false if the timestamp is wrong', function () {
      testHttpRequest = getTestHttpRequest()
      testHttpRequest['X-Slack-Request-Timestamp'] = '1531420619'
      assert.equal(slackValidateRequest(slackSigningSecret, testHttpRequest), false)
    })
  })

  describe('Wrong body', function () {
    it('should return false if the body is not the correct one', function () {
      testHttpRequest = getTestHttpRequest()
      testHttpRequest.body.text = 'test'
      assert.equal(slackValidateRequest(slackSigningSecret, testHttpRequest), false)
    })
  })

  describe('Using an invalid slack request', function () {
    it('should return false', function () {
      testHttpRequest = getTestHttpRequest()
      delete testHttpRequest['X-Slack-Request-Timestamp']
      delete testHttpRequest['X-Slack-Signature']
      assert.equal(slackValidateRequest(slackSigningSecret, testHttpRequest), false)
    })
  })

  describe('Using invalid slack app signing secret', function() {
    it('should throw an error if it\'s undfined', function() {
      testHttpRequest = getTestHttpRequest()
      assert.throws(() => { slackValidateRequest(undefined, testHttpRequest) })
    })
    it('should throw an error if it\'s an empty string', function() {
      testHttpRequest = getTestHttpRequest()
      assert.throws(() => { slackValidateRequest('', testHttpRequest) })
    })
    it('should throw an error if it\'s a non-string', function() {
      testHttpRequest = getTestHttpRequest()
      assert.throws(() => { slackValidateRequest(12344, testHttpRequest) })
    })
  })

  describe('Check validity of logging argument', function() {
    it('should throw an error if logging is not a boolean', function() {
      testHttpRequest = getTestHttpRequest()
      assert.throws(() => { slackValidateRequest(slackSigningSecret, testHttpRequest, 1) })
    })
  })

})
