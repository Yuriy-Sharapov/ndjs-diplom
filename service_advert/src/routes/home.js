const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {

    res.render('home', {
        title: 'Главная',
        user: req.user
    })
})

module.exports = router