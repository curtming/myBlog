const express = require('express')

const router = express.Router()
const articlesServer = require('./service/index')

// router.post('/getLists', articleServer.getLists)
router.post('/create', articlesServer.create)
router.get('/getLists', articlesServer.getLists)

module.exports = router
