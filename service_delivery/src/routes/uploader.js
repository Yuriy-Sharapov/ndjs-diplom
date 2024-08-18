const express = require('express')
const router = express.Router()

const fileMulter = require('../middleware/file')
const stor = require('../storage/storage')
const cBook = require('../classes/cBook')

router.post('/upload-book', 
    fileMulter.single('smb-book'),  // smb-book - это ожидаемое имя файла книги
    (req, res) => {
        if (req.file){
            
            // Добавляем книгу в хранилище
            const newBook     = new cBook(
                                        title       = req.file.originalname,
                                        description = req.file.originalname,
                                        authors     = "",
                                        favorite    = false,
                                        fileCover   = req.file.path,
                                        fileName    = req.file.originalname,
                                        fileBook    = req.file.path)
        
            const {books} = stor
            books.push(newBook)

            const {path} = req.file
            res.json({path})
        }
        else {
            res.json("404 | Файл не найден. Проверьте расширение загружаемого файла")
        }            
        res.json()
})

module.exports = router