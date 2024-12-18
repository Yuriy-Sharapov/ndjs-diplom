const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, path.join(__dirname, '..', 'public', 'adverts', 'images'))
    },
    filename(req, file, cb){
        // в колбек отправляем ошибку (null) и маску с названием файла в нашей папке
        cb(null, `${Date.now()}-img-${Buffer.from(file.originalname, 'latin1').toString()}`)
        // switch (file.fieldname) {
        //     case 'cover':
        //         cb(null, `${Date.now()}-cover-${Buffer.from(file.originalname, 'latin1').toString()}`)
        //         break;
        //     case 'book':
        //         cb(null, `${Date.now()}-book-${Buffer.from(file.originalname, 'latin1').toString()}`)
        //         break;
        // }          
    }
})

// Массив с доступными MIME типами
const allowedTypes = [      
    'image/jpeg',
    'image/jpg',
    'image/png',
]        

const fileFilter = (req, file, cb) => {     // Фильтр типов файлов
    if (allowedTypes.includes(file.mimetype))
        cb(null, true)
    else
        cb(null, false)
}

module.exports = multer({
    storage, 
    limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
    fileFilter
})