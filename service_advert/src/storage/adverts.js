const cAdvert = require('../classes/cAdvert')

// Инициализация базы книг
const advert_list = [
    new cAdvert(
        shortText   = "Футбольный мяч, 5 размер, белый",
        description = "Современные футбольные мячи варьируются от 1-го до 5-го размера для разных возрастов",
        images      = ["ball.jpg", "ball2.jpg", "ball3.jpg"],
        userId      = 1,
        createdAt   = new Date(),
        updatedAt   = null,
        tags        = ["мяч", "футбол"],
        isDeleted   = false ),
    new cAdvert(
        shortText   = "Шнурки резинки с фиксатором плоские с фиксатором",
        description = "Шнурки резинки для обуви с фиксаторами решат вашу проблему развязывающихся шнурков",
        images      = ["laces.jpg", "laces2.jpg"],
        userId      = 1,
        createdAt   = new Date(),
        updatedAt   = null,
        tags        = ["шнурки", "обувь"],
        isDeleted   = false ),
    new cAdvert(
        shortText   = "Ложка для обуви, рожок для обуви, металл, СЕРЕБРО, 45см",
        description = "Рожок для обуви, металл, 45см. (Россия)",
        images      = ["shoespoon.jpg"],
        userId      = 2,
        createdAt   = new Date(),
        updatedAt   = null,
        tags        = ["ложка", "обувь", "обувной рожок"],
        isDeleted   = false ),         
]

const Adverts = require('../models/adverts')
const Users = require('../models/users')
const path = require('path')
const fs = require('fs')

function delete_old_images() {

    console.log(`===delete_old_images=== bigin`)
    const directory = path.join(__dirname, '..', 'public', 'adverts', 'images')

    const items = fs.readdirSync(directory)

    // console.log(`===delete items`)
    // console.log(items)

    items.forEach(item => {
        try {
            fs.rmSync(path.join(directory, item), { force: true });
        } catch (e) {
            //console.log(e)
        }
    });
}

function recover_images() {

    console.log(`===recover_images=== bigin`)

    const directory_from = path.join(__dirname, '..', 'public', 'adverts', 'images', 'backup')
    const directory_to   = path.join(__dirname, '..', 'public', 'adverts', 'images')

    try {
        // восстанавливаем изображения
        const filenames = fs.readdirSync(directory_from)
        // console.log(`===recover files`)
        // console.log(filenames)

        filenames.forEach(file => {
            fs.cpSync(path.join(directory_from, file), path.join(directory_to, file) )
        })
    } catch(e) {
        console.log(`===recover_images===`)
        console.log(e)
    }
}

async function preloadAdverts(){

    try {

        const adverts_count = await Adverts.countDocuments()
        console.log(`adverts_count = ${adverts_count}`)
        if(adverts_count !== 0) return;

        // удаляем старые изображения в папке images
        delete_old_images()
        // восстанавливаем изображения по умолчанию
        recover_images()

        const prefillUser = await Users.findOne().select('-__v')
        console.log(`===prefillUser===`)
        console.log(prefillUser)
        const prefillUserId = prefillUser._id

        const imageDir = '/' + path.join('app','src','public','adverts','images')

        console.log(`Нужно инициализировать данные БД Adverts`)
        for (i = 0; i < advert_list.length; i++){
            const advert = advert_list[i]
            console.log(advert)
           
            const images = advert.images.map( fileName => { return path.join(imageDir, fileName) })
            // console.log(`${advert.shortText} - список картинок`)
            // console.log(images)

            //const {shortText, description, images, createdAt, updatedAt, tags, isDeleted} = advert
            const newAdvert = new Adverts({
                shortText  : advert.shortText,
                description: advert.description,
                images     : images,
                userId     : prefillUserId,
                createdAt  : advert.createdAt,
                updatedAt  : advert.updatedAt,
                tags       : advert.tags,
                isDeleted  : advert.isDeleted
            }) 
            await newAdvert.save()                
        }

    } catch (e) {
        console.log(`Ошибка при обращении к коллекции Adverts`)
        console.log(e)    
    }
}            

module.exports = preloadAdverts