const {RateLimiterDynamo} = require('rate-limiter-flexible')
const { dynamoDBClient } = require("../services/dynamodb").dynamoDBClient;
const { finduser } = require("./authMiddleware");


const maxFailsByIPperDay = 70;
const maxFailsByTonkenAndIP = 10;
const maxFailsByToken = 35;


// Catches IP attempts
const limitSlowerIP = new RateLimiterDynamo({
    inMemoryBlockOnConsumed: maxFailsByIPperDay,
    storeClient: dynamoDBClient,
    dynamoTableOpts: {
        readCapacityUnits: 15,
        writeCapacityUnits: 15,
    },
    keyPrefix: 'req_fail_ip',
    points: maxFailsByIPperDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24, 
});

// Catches IP + Token 
const limitFailsByTokenAndIP = new RateLimiterDynamo({
    inMemoryBlockOnConsumed: maxFailsByTonkenAndIP,
    storeClient: dynamoDBClient,
    dynamoTableOpts: {
        readCapacityUnits: 15,
        writeCapacityUnits: 15,
    },
    keyPrefix: 'req_fail_token_ip',
    points: maxFailsByTonkenAndIP,
    duration: 60 * 60 * 24 * 90,
    blockDuration: 60 * 60 * 24 * 365 * 20
});


// Catches Token
const limitFailsByToken = new RateLimiterDynamo({
    inMemoryBlockOnConsumed: maxFailsByToken,
    storeClient: dynamoDBClient,
    dynamoTableOpts: {
        readCapacityUnits: 15,
        writeCapacityUnits: 15,
    },
    keyPrefix: 'req_fail_token',
    points: maxFailsByToken,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24 * 365 * 20
});

const rateLimiterPreAuth = async(req, resp, next) => {
    let token = req.headers.authorization?.split(' ')[1];
    let ip = req.ip;
    let resTokenAndIP = null;
    let resToken = null;
    let resIP = await limitSlowerIP.get(ip);
    if (token) {
        [ resTokenAndIP, resToken ] = await Promise.all([
            limitFailsByTokenAndIP.get(`${token}_${ip}`), 
            limitFailsByToken.get(token)
        ]);
    } 

    let retryduration = 0;
    if (resIP !== null && resIP.consumedPoints > maxFailsByIPperDay) {
        retryduration = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
        resp.set('Retry-After', String(retrySecs));
    } else if (resTokenAndIP !== null && resTokenAndIP.consumedPoints > maxFailsByTonkenAndIP ) {
        retryduration = Number.MAX_SAFE_INTEGER;
    } else if (resToken !== null && resToken.consumedPoints > maxFailsByToken) {
        retryduration = Number.MAX_SAFE_INTEGER;
    }

    if (retryduration > 0) {
        resp.status(429).send('Too Many Requests');
    } else  {
        resp.locals.tokenIpConsumedPoints = (resTokenAndIP !== null) ? resTokenAndIP.consumedPoints : 0;
        next();
    }
}


module.exports = { rateLimiterPreAuth, limitFailsByToken, limitFailsByTokenAndIP, limitSlowerIP }