const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const db = require('./storage/users')

const verify = (username, password, done) => {
    db.findByUsername(username, (err, user) => {
        if (err) {
            console.log(`Дальше переход к failureRedirect: '/user/login' не сработает!`)
            return done(err,false)
        }
        if (!user) {
            return done(null, false)
        }
  
        if( !db.verifyPassword(user, password)) {
            return done(null, false)
        }
  
        return done(null, user)
    })
}
  
const options = {
    usernameField: "username",
    passwordField: "password"
}
  
passport.use('local', new LocalStrategy(options, verify))

passport.serializeUser((user, cb) => {
    cb(null, user.id)
})

passport.deserializeUser( (id, cb) => {
    db.findById(id,  (err, user) => {
        if (err) { return cb(err) }
        cb(null, user)
    })
})

module.exports.passport = passport
module.exports.session = session({ secret: 'SECRET'})