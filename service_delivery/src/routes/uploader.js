// const express = require('express')
// const router = express.Router()
// const Books = require('../models/books')
// const {multer_books} = require('../middleware/file')
// //const stor = require('../storage/books') // TODO: передалать
// //const cBook = require('../classes/cBook')

// router.post('/upload-book', 
//     multer_books.single('book'),  // smb-book - это ожидаемое имя файла книги
//     async (req, res) => {
//         if (req.file){
            
//             console.log(`===req.file===`)
//             console.log(req.file)

//             // const newBook = new Books({
//             //     title      : req.file.originalname,
//             //     description: req.file.originalname,
//             //     authors    : "",
//             //     favorite   : false,
//             //     fileCover  : req.file.path,
//             //     fileName   : req.file.originalname,
//             //     fileBook   : req.file.path})

//             // try {
//             //     await newBook.save()
//             //     res.redirect('/books')
//             // } catch (e) {
//             //     res.status(500).json(e)
//             // }               
//             // // Добавляем книгу в хранилище
//             // const newBook     = new cBook(
//             //                             title       = req.file.originalname,
//             //                             description = req.file.originalname,
//             //                             authors     = "",
//             //                             favorite    = false,
//             //                             fileCover   = req.file.path,
//             //                             fileName    = req.file.originalname,
//             //                             fileBook    = req.file.path)
        
//             // const {books} = stor
//             // books.push(newBook)

//             const {path} = req.file
//             res.json({path})
//         }
//         else {
//             // console.log("404 | Файл не найден. Проверьте расширение загружаемого файла")
//             // res.redirect('/404')
//             res.json("404 | Файл не найден. Проверьте расширение загружаемого файла")
//         }            
//         //res.json()
// })

// module.exports = router