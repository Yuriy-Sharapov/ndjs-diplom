const express = require('express')
const router = express.Router()
const {passport} = require('../auth')
const bcrypt = require('bcrypt')

const Users = require('../models/users')

router.get('/api/signin', (req, res) => {

    res.render('user/signin', {
      title: 'Авторизация',
      user: req.user
    })
})

router.post('/api/signin',
    passport.authenticate('local', { failureRedirect: '/api/signin' }),
    (req, res) => {

      if (!req.user){
        res.redirect('/api/signin')
        return
      }

      console.log("req.user: ", req.user)
      res.redirect('/')
    }
)

router.get('/api/signup', (req, res) => {

  let user_prefill = { 
    email       : '',
    name        : '',
    contactPhone: ''
  }

  res.render('user/signup', {
    title: 'Регистрация пользователя',
    user: req.user,    
    user_prefill: user_prefill
  })
})

router.post('/api/signup', async (req, res) => {

  const {email, password, password_rep, name, contactPhone} = req.body

  // если пользователь ошибся, то даем ему возможность поправить ввод на странице регистрации
  let user_prefill = {
    email       : email,
    name        : name,
    contactPhone: contactPhone
  }

  // Проверка совпадения пароля и его повтора
  if (password !== password_rep) {
    console.log('Пароли не совпадают')

    res.render('user/signup', {
      title: 'Регистрация пользователя',
      user: req.user,
      user_prefill: user_prefill
    })
    return      
  }

  try {
    const users = await Users.find().select('-__v') 
    console.log(`Все пользователи`)
    console.log(users)
    const user = await Users.findOne({ "email": email }).select('-__v')
    if (user) {
      console.log(`Пользователь ${user.email} уже существует`)    
      res.render('user/signup', {
        title: 'Регистрация пользователя',
        user: req.user,
        user_prefill: user_prefill
      })
      return
    }           
  } catch (e) {
    // идем дальше
  } 

  // зашифруем пароль
  try {
    // получаем соль
    const salt = await bcrypt.genSalt(10)
    // солим и шифруем пароль
    const hash_password = await bcrypt.hash(password, salt)

    console.log(`password - ${password}`)
    console.log(`salt - ${salt}`)
    console.log(`hash - ${hash_password}`)    

    console.log({email, hash_password, name, contactPhone})

    const newUser = Users({
      email       : email,
      passwordHash: hash_password,
      name        : name,
      contactPhone: contactPhone
    })

    try {
      await newUser.save()
      // Успешно создали пользователя, переходим на страницу входа
      res.redirect('/api/signin')
    } catch (e) {
      // нашли пользователя с тем же именем, с которым регистрируются
      console.log('Ошибка при сохранении нового пользовател в БД')
      res.render('user/signup', {
        title: 'Регистрация пользователя',
        user: req.user,
        user_prefill: user_prefill
      })
    } 
  } catch (e) {
    console.log(`Ошибка при шифровании пароля`)
    return;
  }   
})

router.get('/api/logout',  (req, res) => {
  req.logout(function(err) {
    res.redirect('/')
  })
})

router.get('/api/profile',
  (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/api/signin')
    }
    next()
  },
  (req, res) => {
    res.render('user/profile', {
      title: 'Профиль пользователя',
      user: req.user
    })
  }    
)

module.exports = router