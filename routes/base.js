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
  res.redirect('/login')
}

router.get('/profile', isAuthenticated, function(req, res) {
  models.Deck.findAll({ where: { userId: req.user.id } })
  .then(function(data) {
    res.render('profile', { user: req.user, data: data })
  })
  .catch(function(err) {
    res.send(err)
  })
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

router.get('/logout', function(req, res) {
  req.logout()
  res.redirect('/')
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

  models.Deck.create(newDeck)
  .then(function(data) {
    res.redirect('/profile')
  })
  .catch(function(err) {
    res.send(err)
  })
})

router.get('/decks/:id', isAuthenticated, function(req, res) {
  models.Deck.findOne({
    where: { id: req.params.id },
    include: [{
      model: models.Card,
      as: 'cards'
    }]
  })
  .then(function(data) {
    res.render('createCard', { user: req.user, data: data })
  })
})

router.get('/decks/:id/edit', function(req, res) {
  models.Deck.findOne({ where: { id: req.params.id } })
  .then(function(data) {
    res.render('editDeck', { user: req.user, data: data })
  })
  .catch(function(err) {
    res.send(err)
  })
})

router.post('/decks/:id/edit', function(req, res) {
  models.Deck.update({
    name: req.body.name,
    description: req.body.description
  }, { where: { id: req.params.id } })
  .then(function(data) {
    res.redirect('/decks/' + req.params.id)
  })
  .catch(function(err) {
    res.send(err)
  })
})

router.get('/decks/:id/delete', function(req, res) {
  models.Card.destroy({ where: { deckId: req.params.id } })
  .then(function(data) {
    models.Deck.destroy({ where: { id: req.params.id } })
    .then(function(deck) {
      res.redirect('/profile')
    })
    .catch(function(err) {
      res.send(err)
    })
  })
  .catch(function(err) {
    res.send(err)
  })
})

router.post('/decks/:id/cards', isAuthenticated, function(req, res) {
  let newCard = {
    deckId: req.params.id,
    front: req.body.front,
    back: req.body.back
  }
  models.Card.create(newCard)
  .then(function(data) {
    res.redirect('/decks/' + req.params.id)
  })
  .catch(function(err) {
    res.send(err)
  })
})

router.get('/cards/:id/edit', isAuthenticated, function(req, res) {
  models.Card.findOne({ where: { id: req.params.id } })
  .then(function(data) {
    res.render('editCard', { user: req.user, data: data })
  })
  .catch(function(err) {
    res.send(err)
  })
})

router.post('/cards/:id/edit', isAuthenticated, function(req, res) {
  models.Card.update({
    front: req.body.front,
    back: req.body.back
  },
  {
    where: { id: req.params.id }
  })
  .then(function(data) {
    // Find a way to redirect back to the deck view
    res.redirect('/profile')
  })
  .catch(function(err) {
    res.send(err)
  })
})

router.get('/cards/:id/delete', isAuthenticated, function(req, res) {

  models.Card.findOne({
    where: {
      id: req.params.id
    },
    include: [{
      model: models.Deck,
      as: 'card'
    }]
  })
  .then(function(data) {

    models.Card.destroy({ where: { id: req.params.id } })
    .then(function() {
      res.redirect('/decks/' + data.card.id)
    })
    .catch(function(err) {
      res.send(err)
    })
  })
  .catch(function(err) {
    res.send(err)
  })
})

/*****************************
  Quiz-specific code
*****************************/

function shuffleArr(arr) {
  let newArr = []
  while (arr) {
    newArr.push(arr.splice(Math.floor(Math.random() * arr.length)))
  }
  return newArr
}

router.get('/decks/:id/quiz', function(req, res) {
  models.Card.findAll({ where: { deckId: req.params.id } })
  .then(function(data) {

    let length = data.length
    let newArr = []

    for (let i = 0; i < length; i++) {
      let splicedIndex = (data.splice(Math.floor(Math.random() * data.length), 1)[0])
      newArr.push(splicedIndex)
    }

    res.render('quiz', { user: req.user, data: newArr })
  })
  .catch(function(err) {
    res.send(err)
  })
})

router.get('/gameover/:score/:total', function(req, res) {
  let calc = req.params.score / req.params.total
  let message = ''
  if(calc === 1) {
    message = 'Well done! You aced it!'
  } else if (calc > 0.83) {
    message = 'Almost there!'
  } else if (calc > 0.66) {
    message = 'Keep studying!'
  } else {
    message = 'Put some more time into studying'
  }
  calc = calc.toFixed(2) * 100;
  res.render('gameover', {
    user: req.user,
    score: req.params.score,
    total: req.params.total,
    calc: calc,
    message: message
  })
})

module.exports = router
