const express = require('express')
const router = express.Router()
module.exports = router

const axios = require('axios')

const fs = require('fs');
const path = require('path');

const stor = require('../storage/storage')
const cBook = require('../classes/cBook')

// 1. получить все книги
router.get('/books', (req, res) => {

    // получаем массив всех книг
    const {books} = stor

    res.render("books/index", {
        title: "Список книг",
        user: req.user,
        books: books,
    });    
}) 

// 2. создать книгу
router.get('/books/create', (req, res) => {
    res.render("books/create", {
        title: "Добавить новую книгу",
        user: req.user,
        book: {}
    })
})

router.post('/books/create', (req, res) => {
    // создаём книгу и возвращаем её же вместе с присвоенным ID
    const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body
    const newBook = new cBook(title, description, authors, favorite, fileCover, fileName, fileBook)

    const {books} = stor
    books.push(newBook)
    
    res.redirect('/books')
})

// 3. получить книгу по ID
router.get('/books/:id', async(req, res) => { 

    // получаем объект книги, если запись не найдена, вернём Code: 404
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex( el => el.id === id)

    if (idx === -1)
        res.redirect('/404')
    
    const COUNTER_URL = process.env.COUNTER_URL || "http://localhost:3003"
    const access_url = `${COUNTER_URL}/counter/${books[idx].title}`

    let cnt = 0
    try {
        await axios.post(`${access_url}/incr`);
        const axios_res = await axios.get(access_url);
        cnt = axios_res.data.cnt
    } catch (e) { 
        console.log('Ошибка при работе с axios')
        console.log(e)
    }

    let notes = [
        {
            text: 'Комментарий 1',
            username: 'yuriy',
            displayName: "Юрий"
        },
        {
            text: 'Комментарий 2',
            username: 'evgeniy',
            displayName: "Евгений"
        }      
    ]

    res.render("books/view", {
        title: "Просмотреть карточку книги",
        user: req.user,
        book: books[idx],
        cnt: cnt,
        notes: notes
    })
})

// 4. редактировать книгу по ID
router.get('/books/update/:id', (req, res) => {
    // редактируем объект книги, если запись не найдена, вернём Code: 404
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex( el => el.id === id)

    if (idx === -1)
        res.redirect('/404');

    res.render("books/update", {
        title: "Редактирование атрибутов книги",
        user: req.user,
        book: books[idx],
    })
})

router.post('/books/update/:id', (req, res) => {
    // редактируем объект книги, если запись не найдена, вернём Code: 404
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex( el => el.id === id)

    if (idx === -1)
        res.redirect('/404')

    const {title, description, authors, favorite, fileCover, fileName, fileBook} = req.body

    books[idx] = {
        ...books[idx],
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook
    }
    // books[idx].title       = title
    // books[idx].description = description
    // books[idx].authors     = authors
    // books[idx].favorite    = favorite
    // books[idx].fileCover   = fileCover
    // books[idx].fileName    = fileName
    // books[idx].fileBook    = fileBook

    res.redirect(`/books/${id}`);
})

// 5. удалить книгу по ID
router.post('/books/delete/:id', (req, res) => {
    // удаляем книгу и возвращаем ответ: 'ok'
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex( el => el.id === id)

    if (idx === -1)
        res.redirect('/404');

    books.splice(idx, 1)
    res.redirect(`/books`);    
})   

// 6. Скачать книгу
router.get('/books/:id/download', (req, res) => {

    const {books} = stor
    const {id} = req.params

    // Ищем книгу в хранилище по названию, которое передали через параметры
    // В хранилище книга должна иметь сответствующее название fileName
    const idx = books.findIndex( el => el.id === id)   

    if (idx === -1)
        return res.redirect('/404');
    
    // Формируем путь до книги
    const filePath = path.resolve(__dirname, "..", books[idx].fileBook)

    // Проверка, существует ли файл
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log(err)
            return res.redirect('/404');
        }
            // return res.status(404).send('Файл не найден')

        // Отправка файла на скачивание
        res.download(filePath, err => {
            if (err)
                res.status(500).send('Ошибка при скачивании файла')
        })
    })
})