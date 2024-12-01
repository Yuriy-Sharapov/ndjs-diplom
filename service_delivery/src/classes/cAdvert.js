// подключаем генератор гуидов UUID
const { v4: uuid } = require('uuid')

class cAdvert {

    constructor(
            shortText   = "",
            description = "",
            images      = [],
            userId      = "",
            createdAt   = null,
            updatedAt   = null,
            tags        = [],
            isDeleted   = false,
            id          = uuid()){

        this.shortText   = shortText
        this.description = description
        this.images      = images
        this.userId      = userId
        this.createdAt   = createdAt
        this.updatedAt   = updatedAt
        this.tags        = tags
        this.isDeleted   = isDeleted
        this.id          = id              
    }
}

module.exports = cAdvert