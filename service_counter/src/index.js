const express = require('express')
const redis = require('redis')

const app = express()

const PORT = process.env.PORT || 3000
const REDIS_URL = process.env.REDIS_URL || "redis://localhost"

const client = redis.createClient({ url: REDIS_URL });

(async () => {
    await client.connect()
})()

app.get('/counter/:bookId', async (req, res) => {
    const {bookId} = req.params

    try {
        let cnt = await client.get(bookId);
        if (!cnt) cnt = 0
        res.json({ bookId, cnt })
    } catch (e) {
        res.status(500).json({ errcode: 500, errmsg: `redis err: ${e}.`})
    }
})

app.post('/counter/:bookId/incr', async (req, res) => {
    const {bookId} = req.params

    try {
        const cnt = await client.incr(bookId)
        res.json({ bookId, cnt })

    } catch (e) {
        res.status(500).json({ errcode: 500, errmsg: `redis err: ${e}.`})
    }    
})

app.listen(PORT, () => {
    console.log(`Server is listening port ${PORT}...`)
})    