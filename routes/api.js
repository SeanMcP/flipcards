const express = require('express')
const models = require('../models/index')
const router = express.Router()

// Middleware to check for authentication with Basic:
// passport.authenticate('basic', { session: false })

module.exports = router
