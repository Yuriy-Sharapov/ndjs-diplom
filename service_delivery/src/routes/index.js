const express = require('express')
const router = express.Router()

const homeRouter = require('./home')
const userRouter = require('./user')
const advertsRouter = require('./adverts')
// const uploaderRouter = require('./uploader')

router.use('/', homeRouter)
router.use('/', userRouter)
router.use('/', advertsRouter)
// router.use('/', uploaderRouter)

module.exports = router