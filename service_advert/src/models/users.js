const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },    
    name: {
        type: String,
        required: true
    },
    contactPhone: {
        type: String,
        default: ""
    }
})

module.exports = model('users', userSchema)