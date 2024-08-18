const express = require('express')
const router = express.Router()

const homeRouter = require('./home')
const userRouter = require('./user')
const booksRouter = require('./books')
const uploaderRouter = require('./uploader')

router.use('/', homeRouter)
router.use('/', userRouter)
router.use('/', booksRouter)
router.use('/', uploaderRouter)

module.exports = router