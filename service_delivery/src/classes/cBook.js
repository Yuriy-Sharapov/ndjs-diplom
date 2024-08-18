// подключаем генератор гуидов UUID
const { v4: uuid } = require('uuid')

class cBook{

    constructor(
            title       = "",
            description = "", 
            authors     = "",
            favorite    = false,
            fileCover   = "",
            fileName    = "",
            fileBook    = "",
            id          = uuid()){
        
        this.title       = title
        this.description = description
        this.authors     = authors
        this.favorite    = favorite
        this.fileCover   = fileCover
        this.fileName    = fileName
        this.fileBook    = fileBook
        this.id          = id

    }
}

module.exports = cBook