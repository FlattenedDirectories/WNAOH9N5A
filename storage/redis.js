'use strict'

const REDIS_SENTINELS_CONNECTION_STRING = process.env.REDIS_SENTINELS_CONNECTION_STRING ?
  process.env.REDIS_SENTINELS_CONNECTION_STRING :
  '[{"host":"localhost","port":26380},{"host":"localhost","port":26381},{"host":"localhost","port":26382}]'
const REDIS_SENTINELS = JSON.parse(REDIS_SENTINELS_CONNECTION_STRING)
const REDIS_CONNECTION_RETRY_MS = 10000
const Redis = require('ioredis')

console.debug("Redis sentinels:")
console.debug(REDIS_SENTINELS)

var redis = new Redis({
  sentinels: REDIS_SENTINELS,
  name: 'mymaster',
  sentinelRetryStrategy: () => {
    return REDIS_CONNECTION_RETRY_MS
  }
});

const randomIdGenerator = () => {
  var text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 9; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const addRecord = async (url) => {
  var randomId = randomIdGenerator()
  var ret = await redis.setnx(randomId, url)
  while (ret === 0) {
    var randomId = randomIdGenerator()
    var ret = await redis.setnx(randomId, url)
  }
  return randomId
}

const setRateLimit = async (ip, callLimit, timePeriod) => {
  var ret = await redis.psetex(`RATELIMIT|${ip}`, timePeriod, callLimit)
  // ret == "OK" or replace
  return true;
}

const getRateLimit = async (ip) => {
  var ret = await redis.get(`RATELIMIT|${ip}`)
  // Having record
  if (ret != null) {
    // Still have quota
    if (ret > 0) {
      await redis.set(`RATELIMIT|${ip}`, ret-1);
      return true;
    }
    // Banned
    else{
      return false;
    }
  }
  return true;
}

const getRecord = async (key) => {
  return await redis.get(key)
}

module.exports = {
  addRecord,
  getRecord,
  setRateLimit,
  getRateLimit
}
