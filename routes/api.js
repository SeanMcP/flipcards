const express = require('express')
const models = require('../models/index')
const router = express.Router()
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy

// Middleware to check for authentication with Basic:
// passport.authenticate('basic', { session: false })

const sendFunc = function(status, data) {
  let obj = {
    'status': status,
    'data': data
  }
  return obj
}

router.get('/', function(req, res) {
  let str = 'Welcome to the Flipcards API!'
  res.status(200).send(sendFunc('success', str))
})

router.get('/decks', function(req, res) {
  models.Deck.findAll()
  .then(function(data) {
    console.log('THEN res.status', res.status);
    res.status(200).send(sendFunc('success', data))
  })
  .catch(function(err) {
    console.log('CATCH res.status', res.status);
    res.status(400).send(sendFunc('fail', err))
  })
})

module.exports = router
