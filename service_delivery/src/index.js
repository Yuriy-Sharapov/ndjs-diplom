const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())   
app.use(express.urlencoded())
app.set("views","src/views")
app.set('view engine', 'ejs')

const {passport, session} = require('./auth')
app.use(session)
app.use(passport.initialize())
app.use(passport.session())

const socket = require('./socket')
const { server, io } = socket.initServer(app, session, passport)

const router = require('./routes')
app.use(router)

const errorMiddleware = require('./middleware/error')
app.use(errorMiddleware)

// const path = require('path')
// const public_dir = path.join(__dirname,"public")
// console.log(`public dir - ${public_dir}`)
// app.use('/public', express.static(public_dir)) // даем возможность загружать файлы

const preloadBooks = require('./storage/books')
const preloadUsers = require('./storage/users')

// Объявляем асинхронную функциню для соединения с БД и запуском сервера
async function start(PORT, MONGODB_URL) {
    try {
        console.log(`MONGODB_URL - ${MONGODB_URL}`)
        await mongoose.connect(MONGODB_URL);
        await preloadBooks();
        await preloadUsers();
        server.listen(PORT, () => {
            console.log(`Server is listening port ${PORT}...`)
        })
    } catch (e) {
        console.log(`Has no connection to MongoDB`)
    }
}

const MONGODB_URL = process.env.MONGODB_URL
// Настраиваем порт, который будет прослушивать сервер
const PORT = process.env.PORT || 3000
start(PORT, MONGODB_URL)