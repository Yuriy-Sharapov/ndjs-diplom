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
router.get('/adverts', async (req, res) => {

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
router.get('/adverts/create', (req, res) => {
    res.render("adverts/create", {
        title: "Добавить новое объявление",
        user: req.user,
        advert: {}
    })
})

router.post('/adverts/create',
    // multer.fields([
    //     { name: 'image', maxCount: 1 },
    //     { name: 'advert',  maxCount: 1 }
    // ]),
    async (req, res) => {

    console.log(`===post===`)
    console.log(req.body)

    // создаём объявление и возвращаем его же вместе с присвоенным ID
    const { shortText, description, tags, isDeleted } = req.body
    const isDeleted_bool = isDeleted === 'on' ? true: false

    // let fileCover = ""
    // if (req.files.cover !== undefined)
    //     fileCover = req.files.cover[0].path

    // let fileName = ""
    // let fileadvert = ""
    // if (req.files.advert !== undefined) {
    //     fileName = req.files.advert[0].filename
    //     fileadvert = req.files.advert[0].path
    // }

    const newAdvert = new Adverts({
        shortText  : shortText,
        description: description,
        images     : [],
        userId     : req.user.id,
        createdAt  : new Date(),
        updatedAt  : null,
        tags       : tags,
        isDeleted  : isDeleted_bool
    })

    try {
        await newAdvert.save()
        res.redirect('/adverts')
    } catch (e) {
        res.status(500).json(e)
    }     
})

// 3. получить объявление по ID
router.get('/adverts/:id', async (req, res) => {

    // получаем объект объявления, если запись не найдено, вернём Code: 404
    const {id} = req.params
    //console.log(id)

    try {
        const advert = await Adverts.findById(id).select('-__v')
        console.log(`advert - ${advert}`)

        // const COUNTER_URL = process.env.COUNTER_URL || "http://localhost:3003"
        // const access_url = `${COUNTER_URL}/counter/${advert.title}`

        // //console.log(`REDIS access_url - ${access_url}`)

        // let cnt = 0
        // try {
        //     await axios.post(`${access_url}/incr`);
        //     const axios_res = await axios.get(access_url);
        //     cnt = axios_res.data.cnt
        //     console.log(`Количество обращений ${cnt}`)
        // } catch (e) { 
        //     console.log('Ошибка при работе с axios')
        //     console.log(e)
        // }
    
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

        res.render("adverts/view", {
            title : "Карточка объявления",
            user  : req.user,
            advert: { ...advert, authorName: req.user.name },
            // cnt: cnt,
            notes : notes
        })        
    } catch (e) {
        console.log(`Ошибка при обращении к объявлению`)
        console.log(e)
        res.redirect('/404')
    }  
})

// 4. редактировать объявление по ID
router.get('/adverts/update/:id', async (req, res) => {
    // редактируем объект объявления, если запись не найдена, вернём Code: 404
    const {id} = req.params

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

router.post('/adverts/update/:id',
    // multer.fields([
    //     { name: 'cover', maxCount: 1 },
    //     { name: 'advert',  maxCount: 1 }
    //   ]),
    async (req, res) => {
    // редактируем объект объявления, если запись не найдена, вернём Code: 404
    console.log(`===req.body===`)
    console.log(req.body)

    const {id} = req.params
    const {shortText, description, tags, isDeleted} = req.body
    const isDeleted_bool = isDeleted === 'on' ? true: false

    try {
        const dbAdvert = await Adverts.findById(id).select('-__v')

        console.log(`===req.files===`)
        console.log(req.files)
        
        // let fileCover = dbAdvert.fileCover;
        // if (req.files.cover !== undefined) {
        //     // Пришел новый файл обложки, надо удалить старый файл
        //     console.log(`Нужно удалить файл обложки - ${fileCover}`)
        //     try{
        //         fs.unlinkSync(fileCover)
        //     } catch (e) {
        //         console.log(`Файл ${fileCover} не удален`)
        //         console.log(e)
        //     }
        //     fileCover = req.files.cover[0].path
        // }

        // let fileName = dbAdvert.fileName
        // let fileBook = dbAdvert.fileBook
        // if (req.files.advert !== undefined) {
        //     // Пришел новый файл книги, надо удалить старый файл
        //     console.log(`Нужно удалить файл книги - ${fileAdvert}`)
        //     try{
        //         fs.unlinkSync(fileAdvert)
        //     } catch (e) {
        //         console.log(`Файл ${fileAdvert} не удален`)
        //         console.log(e)
        //     }        
        //     fileName = req.files.advert[0].filename
        //     fileadvert = req.files.advert[0].path
        // }
        // const newAdvert = new Adverts({
        //     shortText  : shortText,
        //     description: description,
        //     images     : [],
        //     userId     : req.user.id,
        //     createdAt  : new Date(),
        //     updatedAt  : null,
        //     tags       : tags,
        //     isDeleted  : isDeleted_bool
        // })

        console.log(`===put post===`)
        console.log({ shortText, description, updatedAt, tags, isDeleted})
        try {
            await Adverts.findByIdAndUpdate(id, {
                shortText,
                description,
                updatedAt: new Date(),
                tags,
                authors,
                isDeleted: isDeleted_bool
            })
            res.redirect(`/adverts/${id}`);
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
router.post('/adverts/delete/:id', async (req, res) => {
    // удаляем обяъявление и возвращаем ответ: 'ok'
    const {id} = req.params   

    try {
        const dbAdvert = await Adverts.findById(id).select('-__v')
        // try{
        //     fs.unlinkSync(dbAdvert.fileCover)
        // } catch (e) {
        //     console.log(`Файл обложки ${dbAdvert.fileCover} не удален`)
        //     console.log(e)
        // }
        // try{
        //     fs.unlinkSync(dbAdvert.fileBook)
        // } catch (e) {
        //     console.log(`Файл книги ${dbAdvert.fileBook} не удален`)
        //     console.log(e)
        // }

        await Adverts.deleteOne({_id: id})
        res.redirect(`/adverts`); 
    } catch (e) {
        res.redirect('/404');
    }      
})   

// // 6. Скачать объявление
// router.get('/adverts/:id/download', async(req, res) => {

//     const {id} = req.params

//     try {
//         const advert = await Adverts.findById(id).select('-__v')

//         // Формируем путь до книги
//         const filePath = path.resolve(__dirname, "..", advert.fileBook)

//         // Проверка, существует ли файл
//         fs.access(filePath, fs.constants.F_OK, (err) => {
//             if (err) {
//                 res.redirect('/404')
//                 return 
//             }

//             // Отправка файла на скачивание
//             res.download(filePath, err => {
//                 if (err)
//                     res.status(500).send('Ошибка при скачивании файла')
//             })
//         })
//     } catch (e) {
//         res.redirect('/404')
//     }
// })