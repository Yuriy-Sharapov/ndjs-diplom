const multer = require('multer')

const storage = multer.diskStorage({
    destination(req, file, cb){
        // в колбек отправляем ошибку (null) и название папки, куда будем сохранять файлы
        cb(null, 'public/books')
    },
    filename(req, file, cb){
        // в колбек отправляем ошибку (null) и маску с названием файла в нашей папке
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

// module.exports = multer({storage})

// Массив с доступными MIME типами
const allowedTypes = [      
    'application/pdf',
    'application/rtf',
    'application/vnd.oasis.opendocument.text',
    'text/plain',
    'text/html'
]        

const fileFilter = (req, file, cb) => {     // Фильтр типов файлов
    if (allowedTypes.includes(file.mimetype))
        cb(null, true)
    else
        cb(null, false)
}

module.exports = multer({storage, fileFilter})