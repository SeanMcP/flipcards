const express = require('express')
const mustacheExpress = require('mustache-express')
const expressValidator = require('express-validator')
const path = require('path')
const routesBase = require('./routes/base')
const routesApi = require('./routes/api')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const passport = require('passport')
const BasicStrategy = require('passport-http').BasicStrategy
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')
const flash = require('express-flash-messages')
const models = require('./models/index')
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))

app.engine('mustache', mustacheExpress())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'mustache')
app.set('layout', 'layout')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(morgan('dev'))

app.use(cookieParser())
app.use(session({
  secret: 'Speak friend and enter',
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(function(req, res, next) {
  res.locals.errorMessage = req.flash('error')
  next()
})

const authenticateUser = function(username, password, done) {
  models.User.findOne({
    where: {
      'username': username.toLowerCase()
    }
  }).then(function (user) {
    if (user == null) {
      return done(null, false, { message: 'Invalid email and/or password: please try again' })
    }

    let hashedPassword = bcrypt.hashSync(password, user.salt)

    if (user.password === hashedPassword) {
      return done(null, user)
    }

    return done(null, false, { message: 'Invalid email and/or password: please try again' })
  })
}

passport.use(new LocalStrategy(authenticateUser))
passport.use(new BasicStrategy(authenticateUser))

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(function(id, done) {
  models.User.findOne({
    where: {
      'id': id
    }
  }).then(function (user) {
    if (user == null) {
      done(new Error('Wrong user id'))
    }

    done(null, user)
  })
})

app.use('/api', require('./routes/api'))
app.use('/', require("./routes/base"))

app.use(function (req, res, next) {
  res.locals.user = req.user
  next()
})

app.use(expressValidator())
app.use(routesBase)
app.use(routesApi)

// We have to make sure that we are running on the correct environment for testing purposes
// When you run the app from the testing file, it will not load the server
if (require.main === module) {
  app.listen(3000, function() {
    console.log('App is running on localhost:3000')
  })
}

// app must be exported for testing purposes
module.exports = app
