const cAdvert = require('../classes/cAdvert')

// Инициализация базы книг
const advert_list = [
    new cAdvert(
        shortText   = "Футбольный мяч, 5 размер, белый",
        description = "Современные футбольные мячи варьируются от 1-го до 5-го размера для разных возрастов",
        images      = ["ball.webp"],
        userId      = 1,
        createdAt   = new Date,
        updatedAt   = null,
        tags        = ["мяч", "футбол"],
        isDeleted   = false ),
    new cAdvert(
        shortText   = "Шнурки резинки с фиксатором плоские с фиксатором",
        description = "Шнурки резинки для обуви с фиксаторами решат вашу проблему развязывающихся шнурков",
        images      = ["laces.webp"],
        userId      = 1,
        createdAt   = new Date,
        updatedAt   = null,
        tags        = ["шнурки", "обувь"],
        isDeleted   = false ),
    new cAdvert(
        shortText   = "Ложка для обуви, рожок для обуви, металл, СЕРЕБРО, 45см",
        description = "Рожок для обуви, металл, 45см. (Россия)",
        images      = ["shoespoon.webp"],
        userId      = 2,
        createdAt   = new Date,
        updatedAt   = null,
        tags        = ["ложка", "обувь", "обувной рожок"],
        isDeleted   = false ),         
]

const Adverts = require('../models/adverts')

async function preloadAdverts(){

    try {

        const adverts_count = await Adverts.countDocuments()
        console.log(`adverts_count = ${adverts_count}`)
        if(adverts_count !== 0) return;

        console.log(`Нужно инициализировать данные БД Adverts`)
        for (i = 0; i < advert_list.length; i++){
            const advert = advert_list[i]
            console.log(advert)

            const {shortText, description, images, userId, createdAt, updatedAt, tags, isDeleted} = advert
            const newAdvert = new Adverts({shortText, description, images, userId, createdAt, updatedAt, tags, isDeleted})
            await newAdvert.save()                
        }

    } catch (e) {
        console.log(`Ошибка при обращении к коллекции Adverts`)
        console.log(e)
    }
}

module.exports = preloadAdverts