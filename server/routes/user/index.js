const express = require('express')
const router = express.Router()

const userServer = require('./service/index')

router.post('/login', userServer.userLogin)
router.post('/register', userServer.userRegister)

module.exports = router
