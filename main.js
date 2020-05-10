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

app.get("/:lnk([a-zA-Z0-9]{9})", async (req, res, next) => {
  const { lnk } = req.params
  const url = await redis.getRecord(lnk)
  if (url) {
    res.redirect(304, url)
  } else {
    next()
  }
})

app.listen(PORT, () => {
  console.log(`Express listening on port ${PORT}!`)
})
