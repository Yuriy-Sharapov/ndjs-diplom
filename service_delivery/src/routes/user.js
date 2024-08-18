const express = require('express')
const router = express.Router()
const {passport} = require('../auth')

const db = require('../storage/users')

router.get('/user/login', (req, res) => {

    res.render('user/login', {
      title: 'Авторизация',
      user: req.user
    })
})

router.post('/user/login',
    passport.authenticate('local', { failureRedirect: '/user/login' }),
    (req, res) => {

      if (!req.user){
        res.redirect('/user/login')
        return
      }

      console.log("req.user: ", req.user)
      res.redirect('/')

      // const {username, password} = req.body
      // console.log(`username: ${username}, passwod: ${password}`)

      // db.findByUsername(username, (err, user) =>{
      //   if (err){
      //     console.log('Не найден пользователь')
      //     res.redirect('/user/login')
      //     return
      //   }

      //   console.log("user из БД: ", user)
      //   if (!db.verifyPassword(user, password)){
      //     console.log('Неверный пароль')
      //     res.redirect('/user/login')
      //     return
      //   }

      //   console.log(`Найден пользователь`)
      //   console.log(`username: ${user.username}, password: ${user.password}`)
      //   res.redirect(`/user/profile/${user.id}`)
      // })
    }
)

router.get('/user/signup', (req, res) => {

  let user_prefill = { 
    username: '',
    displayName: '',
    email: ''
  }

  res.render('user/signup', {
    title: 'Авторизация',
    user: req.user,    
    user_prefill: user_prefill
  })
})

router.post('/user/signup',(req, res) => {

    const {username, password, password_rep, displayName, email} = req.body

    if (password !== password_rep) {
      console.log('Пароли не совпадают')

      // если пользователь ошибся, то даем ему возможность поправить ввод на странице регистрации
      let user_prefill = {
        username: username,
        displayName: displayName,
        email: email
      }

      res.render('user/signup', {
        title: 'Авторизация',
        user: req.user,
        user_prefill: user_prefill
      })
      return      
    }

    let newUser = {
      username: username,
      password: password,
      displayName: displayName,
      email: email
    }

    db.findByUsername(username, (err, user) =>{

      if (user){
        console.log('Такой пользователь уже существует')
        res.render('user/signup', {
          title: 'Авторизация',
          user: req.user,
          user_prefill: newUser
        })
        return
      }

      db.addNewUser(newUser, (err, newDbUser) =>{
        if (err){
          console.log('Такой пользователь уже существует')
          res.render('user/signup', {
            title: 'Авторизация',
            user: req.user,
            user_prefill: newUser
          })
          return
        }        
        console.log(`Пользователь создан`)
        console.log(newDbUser)
        res.redirect('/user/login')
      })      
    })

    // if (password !== password_rep) {
    //   console.log('Пароли не совпадают')

    //   // если пользователь ошибся, то даем ему возможность поправить ввод на странице регистрации
    //   let user_prefill = {
    //     username: username,
    //     displayName: displayName,
    //     email: email
    //   }

    //   res.render('user/signup', {
    //     title: 'Авторизация',
    //     user: req.user,
    //     user_prefill: user_prefill
    //   })
    //   return      
    // }

    // let newUser = {
    //   username: username,
    //   password: password,
    //   displayName: displayName,
    //   email: email
    // }

    // db.findByUsername(username, (err, user) =>{

    //   console.log('-------------------')
    //   console.log(`username: ${newUser.username}, password: ${newUser.password}`)
    //   console.log(`displayName: ${newUser.displayName}, email: ${newUser.email}`)

    //   if (user){
    //     console.log('Такой пользователь уже существует')
    //     res.render('user/signup', {
    //       title: 'Авторизация',
    //       user: req.user,
    //       user_prefill: newUser
    //     })
    //     return
    //   }

    //   db.addNewUser(newUser, (err, newDbUser) =>{
    //     if (err){
    //       console.log('Такой пользователь уже существует')
    //       res.render('user/signup', {
    //         title: 'Авторизация',
    //         user: req.user,
    //         user_prefill: newUser
    //       })
    //       return
    //     }        
    //     console.log(`Пользователь создан`)
    //     console.log(`id: ${newDbUser.id}, username: ${newDbUser.username}, passwod: ${newDbUser.password}`)
    //     res.redirect(`/user/profile/${newDbUser.id}`)
    //   })      
    // })
  }
)

router.get('/user/logout',  (req, res) => {
    req.logout(function(err) {
      res.redirect('/')
    })
})

router.get('/user/profile',
    (req, res, next) => {
      if (!req.isAuthenticated()) {
        return res.redirect('/user/login')
      }
      next()
    },
    (req, res) => {
      res.render('user/profile', {
        title: 'Профиль пользователя',
        user: req.user
      })
    }    
    // (req, res) => {

    //   const {id} = req.params
    //   db.findById(id, (err, user) =>{
    //     if (err){
    //       console.log('Не найден пользователь')
    //       res.redirect('/user/login')
    //       return
    //     }

    //     res.render('user/profile', {
    //       title: 'Профиль пользователя',
    //       user: user
    //     })
    //   })
    // }
)

router.get('/user/user_data', function(req, res) {

  if (req.user === undefined) {
      // The user is not logged in
      res.json({});
  } else {
      res.json({
          user: req.user
      });
  }
});

module.exports = router