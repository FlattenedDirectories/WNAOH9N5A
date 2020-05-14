'use strict'

const PORT = process.env.EXPRESS_PORT ? process.env.EXPRESS_PORT : 8080
const HTTPS_ENABLED = !!process.env.HTTPS_ENABLED
const DOMAIN_URI = process.env.DOMAIN ?
  `${HTTPS_ENABLED ? 'https' : 'http'}://${process.env.DOMAIN}/`:
  `http://localhost:${PORT}/`

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const redis = require('./storage/redis')

app.use(bodyParser.json())

app.get('/ping', (req, res, next) => {
  res.send('pong')
})

app.post('/newurl', async (req, res, next) => {
  const requestObj = req.body
  const responseObj = {
    url: requestObj.url,
    shorten_url: `${DOMAIN_URI}${await redis.addRecord(requestObj.url)}`
  }
  res.send(responseObj)
})

app.post('/rate_limit', async (req, res, next) => {
  const requestObj = req.body
  if (!requestObj.rules) {s
    console.error("rules not found.");
    next()
  }
  for (var i in requestObj.rules) {
    let rule = requestObj.rules[i];
    await redis.setRateLimit(rule.ip, rule.limit, rule.time)
  }
  res.send("Set")
})

app.get("/:lnk([a-zA-Z0-9]{9})", async (req, res, next) => {
  const { lnk } = req.params
  // Rate limit checkings
  var pass = true;
  
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.substr(0, 7) == "::ffff:") {
    ip = ip.substr(7)
  }

  console.log(`Current IP is ${ip}`);

  pass = await redis.getRateLimit(ip)

  if(pass) {
    const url = await redis.getRecord(lnk)
    if (url) {
      res.redirect(304, url)
    } else {
      res.send("Short link not found")
    }
  }
  else{
    res.send("You have been rate limited.")
  }
})

app.listen(PORT, () => {
  console.log(`Express listening on port ${PORT}!`)
})
