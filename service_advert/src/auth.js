const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

const Users = require('./models/users')

const verify = async (email, password, done) => {

    try {
        const user = await Users.findOne({ "email": email }).select('-__v')
        console.log(`user verify - ${user}`)
        console.log(`user input password - ${password}`)
        console.log(`user db password - ${user.passwordHash}`)

        const success = await bcrypt.compare(password, user.passwordHash)
        console.log(`psw_check_res - ${success}`)

        if (success === false) {
            console.log(`Пароль неверный`)
            return done(null, false);
        }
        else {
            console.log(`Пароль верный`)
            return done(null, user);
        }

    } catch (e) {
        console.log(`Ошибка при аутентификации пользователя`)
        console.log(e)
        return done(null, false)
    } 
}
  
const options = {
    usernameField: "email",
    passwordField: "password"
}
  
passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser( async (id, cb) => {

    try {
        const user = await Users.findById(id).select('-__v')
        cb(null, user)       
    } catch (e) {
        return cb(err)
    }     
})

module.exports.passport = passport
module.exports.session = session({ secret: 'SECRET'})