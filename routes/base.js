const express = require('express')
const models = require('../models/index')
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = express.Router()

const isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('error', 'You have to be logged in to access the page.')
  res.redirect('/')
}

router.get('/profile', function(req, res) {
  res.render('profile')
})

router.get('/', function(req, res) {
  res.render('login', {
    user: req.user,
    messages: res.locals.getMessages()
  })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/',
    failureFlash: true
}))

router.get('/login', function(req, res) {
  res.render('login', {
    user: req.user,
    messages: res.locals.getMessages()
  })
})

router.get('/signup', function(req, res) {
  res.render('signup', { messages: res.locals.getMessages() })
})

router.post('/signup', async function(req, res) {

  req.checkBody('username', 'Please choose a username').notEmpty()
  req.checkBody('password', 'Please choose a password').notEmpty()
  req.checkBody('username', 'Usernames can only contain letters and numbers').isAlphanumeric()
  req.checkBody('username', 'Usernames should be between 4 and 20 characters').len(4, 20)
  req.checkBody('password', 'Passwords should be between 4 and 20 characters').len(4, 20)

  let isError = false

  let errors = await req.getValidationResult()

  errors.array().map(function(error){
    isError = true
    req.flash('error', error.msg)
  })

  let username = req.body.username.toLowerCase()
  let password = req.body.password
  let confirm = req.body.confirm

  if (!username || !password) {
    res.flash('error', 'Please fill in all the fields')
    res.redirect('/signup')
  } else if (password !== confirm) {
    req.flash('error', 'Passwords to not match.')

    res.redirect('/signup')
  } else if (isError) {
    res.redirect('/signup')
  } else {

    let salt = bcrypt.genSaltSync(10)
    let hashedPassword = bcrypt.hashSync(password, salt)

    let newUser = {
      username: username,
      salt: salt,
      password: hashedPassword
    }

    models.User.create(newUser)
    .then(function() {
      req.session.messages = []
      res.redirect('/')
    }).catch(function(error) {
      req.flash('error', 'Please choose a different username.')
      res.redirect('/signup')
    })

  }
})

router.get('/decks', function(req, res) {
  res.render('createDeck')
})

router.post('/decks', isAuthenticated, function(req, res) {
  let newDeck = {
    name: req.body.name,
    description: req.body.description,
    userId: req.user.id
  }
  console.log('newDeck: ', newDeck)

  models.Deck.create(newDeck)
  .then(function(data) {
    res.redirect('back')
  })
  .catch(function(err) {
    res.send(err)
  })
})

module.exports = router
