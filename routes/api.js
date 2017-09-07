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

router.get('/me', passport.authenticate('basic', { session: false }), function(req, res) {
  res.status(200).json(req.user)
})

router.get('/', function(req, res) {
  let str = 'Welcome to the Flipcards API!'
  res.status(200).send(sendFunc('success', str))
})

router.get('/decks', passport.authenticate('basic', { session: false }), function(req, res) {

  models.Deck.findAll()
  .then(function(data) {
    res.status(200).send(sendFunc('success', data))
  })
  .catch(function(err) {
    res.status(400).send(sendFunc('fail', err))
  })
})

router.post('/decks', passport.authenticate('basic', { session: false }), function(req, res) {
  let newDeck = {
    name: req.body.name,
    description: req.body.description,
    userId: req.user.id
  }

  models.Deck.create(newDeck)
  .then(function(data) {
    res.status(200).send(sendFunc('succuss', data))
  })
  .catch(function(err) {
    res.status(304).send(sendFunc('fail', err))
  })
})

router.post('/decks/:id/cards', passport.authenticate('basic', { session: false }), function(req, res) {
  let newCard = {
    deckId: req.params.id,
    front: req.body.front,
    back: req.body.back
  }
  models.Card.create(newCard)
  .then(function(data) {
    res.status(200).send(sendFunc('success', data))
  })
  .catch(function(err) {
    res.status(304).send(sendFunc('fail', err))
  })
})

router.put('/cards/:id', passport.authenticate('basic', { session: false }), function(req, res) {
  models.Card.update({
    front: req.body.front,
    back: req.body.back
  },
  {
    where: { id: req.params.id }
  })
  .then(function(data) {
    res.status(200).send(sendFunc('success', data))
  })
  .catch(function(err) {
    res.status(304).send(sendFunc('fail', err))
  })
})

router.delete('/cards/:id', passport.authenticate('basic', { session: false }), function(req, res) {
  models.Card.destroy({ where: { id: req.params.id } })
  .then(function(data) {
    res.status(200).send(sendFunc('success', data))
  })
  .catch(function(err) {
    res.status(200).send(sendFunc('fail', err))
  })
})

module.exports = router
