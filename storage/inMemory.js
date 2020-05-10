'use strict'

const randomIdGenerator = () => {
  var text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const inMemoryDb = {}

const addRecord = (url) => {
  var randomId = randomIdGenerator()
  while (typeof inMemoryDb[randomId] !== 'undefined'){
    randomId = randomIdGenerator()
  }
  inMemoryDb[randomId] = url
  return randomId
}

const getRecord = (lnk) => {
  return typeof inMemoryDb[lnk] === 'undefined' ? null : inMemoryDb[lnk]
}

module.exports = {
  addRecord,
  getRecord
}
