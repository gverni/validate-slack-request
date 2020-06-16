/**
 * Tests for the standard http request object
 */

const EventEmitter = require('events')
const { stringify } = require('querystring')

const runTests = require('./util')
const eventEmitter = new EventEmitter()

function getTestHttpRequest (textArgs, bodyChanges) {
    const body = {
        'token': 'xyzz0WbapA4vBCDEFasx0q6G',
        'team_id': 'T1DC2JH3J',
        'team_domain': 'testteamnow',
        'channel_id': 'G8PSS9T3V',
        'channel_name': 'foobar',
        'user_id': 'U2CERLKJA',
        'user_name': 'roadrunner',
        'command': '/webhook-collect',
        'text': textArgs || '',
        'response_url': 'https://hooks.slack.com/commands/T1DC2JH3J/397700885554/96rGlfmibIGlgcZRskXaIFfN',
        'trigger_id': '398738663015.47445629121.803a0bc887a14d10d2c447fce8b6703c',
        ...bodyChanges
    }

    process.nextTick(() => {
        eventEmitter.emit('data', stringify(body))
        eventEmitter.emit('end')
    });

    return {
        'headers': {
            'x-slack-request-timestamp': '1531420618',
            'x-slack-signature': textArgs ? 'v0=a3e650d30d1e91901834f91d048c9d3c0a50e4dcffcef7bc67884e95df8588ce' : 'v0=a2114d57b48eac39b9ad189dd8316235a7b4a8d21a10bd27519666489c69b503',
        },
        on: (name, cb) => eventEmitter.on(name, cb)
    }
}

runTests('http', getTestHttpRequest)