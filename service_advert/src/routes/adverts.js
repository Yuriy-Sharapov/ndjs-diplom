const express = require('express')
const router = express.Router()
module.exports = router

const axios = require('axios')

const fs = require('fs');
const path = require('path');

const Adverts = require('../models/adverts')
const Users = require('../models/users')
const Comments = require('../models/comments')
const multer= require('../middleware/multer')

// 1. получить все объявления
router.get('/api/adverts', async (req, res) => {

    try {
        const adverts = await Adverts.find().select('-__v')

        res.render("adverts/index", {
            title: "Список объявлений",
            user: req.user,
            adverts: adverts,
        });  
    } catch (e) {
        res.status(500).json(e)
    }  
}) 

// 2. создать объявление
router.get('/api/adverts/create', (req, res) => {
    res.render("adverts/create", {
        title: "Добавить новое объявление",
        user: req.user,
        advert: {}
    })
})

router.post('/api/adverts/create',
    multer.array('uploadedImages', 3),
    async (req, res) => {

    console.log(`===post===`)
    console.log(req.body)

    // создаём объявление и возвращаем его же вместе с присвоенным ID
    const { shortText, description, tags, isDeleted } = req.body
    const isDeleted_bool = isDeleted === 'on' ? true: false

    let tagsArray = []
    if (tags)
        tagsArray = tags.split(",").map(item => { return item.trim() })

    console.log(`===req.files====`)
    const imagePaths = req.files.map(file => { return file.path })
    console.log(imagePaths)
  
    const newAdvertData = {
        shortText  : shortText,
        description: description,
        images     : imagePaths,
        userId     : req.user.id,
        createdAt  : new Date(),
        updatedAt  : null,
        tags       : tagsArray,
        isDeleted  : isDeleted_bool
    }
    console.log(`===newAdvertData===`)
    console.log(newAdvertData)

    const newAdvert = new Adverts(newAdvertData)

    try {
        await newAdvert.save()
        res.redirect('/api/adverts')
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }     
})

// 3. получить объявление по ID
router.get('/api/adverts/:id', async (req, res) => {

    // получаем объект объявления, если запись не найдено, вернём Code: 404
    const {id} = req.params
    //console.log(id)

    try {
        const advert = await Adverts.findById(id).select('-__v')
        // console.log(`advert - ${advert}`)

        const author = await Users.findById(advert.userId).select('-__v')
        // console.log(`author - ${author}`)

        const COUNTER_URL = process.env.COUNTER_URL || "http://localhost:3003"
        const access_url = `${COUNTER_URL}/counter/${advert._id}`

        // console.log(`REDIS access_url - ${access_url}`)

        let view_advert_count = 0
        try {
            await axios.post(`${access_url}/incr`);
            const axios_res = await axios.get(access_url);
            view_advert_count = axios_res.data.cnt
            // console.log(`Количество обращений ${view_advert_count}`)
        } catch (e) { 
            console.log('Ошибка при работе с axios')
            console.log(e)
        }
    
        const comments = await Comments.find({ advertId: id }).select('-__v').sort( { date : -1 } )
        //console.log(`comments - ${comments}`)
        // Создаем новый список комментариев, в котором будут имена пользователей
        notes = []
        for (i = 0; i < comments.length; i++) {
            //console.log(`comment = ${comments[i]}`)
            const comm_user = await Users.findById(comments[i].userId).select('-__v')
            notes.push( {
                name: comm_user.name,
                date: comments[i].date.toLocaleString('ru'),
                text: comments[i].text
            })
        }
        //console.log(`notes - ${notes}`)
        // console.log(`===`)
        // console.log(advert)

        const imagesUrlRow = advert.images.join(", ")
        const tagsRow      = advert.tags.join(", ")
        const shortImagePaths = advert.images.map( imagePath => { return imagePath.replace('/app/src','') })

        const msg = {
            id          : advert._id,
            shortText   : advert.shortText,
            description : advert.description,
            images      : shortImagePaths,
            imagesUrlRow: imagesUrlRow,
            authorName  : author.name,
            createdAt   : advert.createdAt.toLocaleString('ru'),
            updatedAt   : advert.updatedAt?.toLocaleString('ru'),
            tags        : tagsRow,
            isDeleted   : advert.isDeleted
        }
        console.log(msg)

        res.render("adverts/view", {
            title            : "Карточка объявления",
            user             : req.user,
            advert           : msg,
            view_advert_count: view_advert_count,
            notes            : notes
        })        
    } catch (e) {
        console.log(`Ошибка при обращении к объявлению`)
        console.log(e)
        res.redirect('/404')
    }  
})

// 4. редактировать объявление по ID
router.get('/api/adverts/update/:id', async (req, res) => {
    // редактируем объект объявления, если запись не найдена, вернём Code: 404
    const {id} = req.params

    console.log(`router.get('/api/adverts/update/:id'`)
    try {
        const advert = await Adverts.findById(id).select('-__v')

        console.log(`===put get===`)
        console.log(advert)

        res.render("adverts/update", {
            title: "Редактирование объявления",
            user: req.user,
            advert: advert,
        })        
    } catch (e) {
        res.redirect('/404')
    } 
})

router.post('/api/adverts/update/:id',
    multer.array('uploadedImages', 3),
    async (req, res) => {
    // редактируем объект объявления, если запись не найдена, вернём Code: 404
    console.log(`===req.body===`)
    console.log(req.body)

    const {id} = req.params
    const {shortText, description, tags, isDeleted} = req.body
    const isDeleted_bool = isDeleted === 'on' ? true: false

    const tagsArray = tags.split(",").map(item => { return item.trim() })
 
    try {
        const dbAdvert = await Adverts.findById(id).select('-__v')

        console.log(`dbAdvert.images`)
        console.log(dbAdvert.images)

        // получаем новые файлы изображений
        console.log(`===req.files====`)
        const newImagePaths = req.files.map(file => { return file.path })
        console.log(newImagePaths)
        
        // добавляем новые файлы изображений к старым
        const accumImagesArray = dbAdvert.images.concat(newImagePaths)
        console.log(`===accumImagesArray===`)
        console.log(accumImagesArray)

        console.log(`===put post===`)
        console.log({ shortText, description, tags, isDeleted_bool})
        try {
            await Adverts.findByIdAndUpdate(id, {
                shortText,
                description,
                images   : accumImagesArray,
                updatedAt: new Date(),
                tags     : tagsArray,
                isDeleted: isDeleted_bool
            })
            res.redirect(`/api/adverts/${id}`);
        } catch (e) {
            res.redirect('/404')
        } 
    } catch (e) {
        console.log(`Ошибка при обращении к объявлению`)
        console.log(e)
        res.redirect('/404')
        return        
    }  
})

// 5. удалить объявление по ID
router.post('/api/adverts/delete/:id', async (req, res) => {
    // удаляем обяъявление и возвращаем ответ: 'ok'
    const {id} = req.params   
 
    try {
        const dbAdvert = await Adverts.findById(id).select('-__v')

        // При удалении объявления, удаляем файлы изображений из папки            
        dbAdvert.images.forEach(imagePath => {        
            try{
                fs.unlinkSync(imagePath)            
            } catch (e) {
                console.log(`Изображение ${imagePath} не удалено`)
                console.log(e)
            }
        })

        await Adverts.deleteOne({_id: id})
        res.redirect(`/api/adverts`); 
    } catch (e) {
        res.redirect('/404');
    }      
})