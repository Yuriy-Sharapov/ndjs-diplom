const {Schema, model, ObjectId} = require('mongoose')

const commentSchema = new Schema({
    advertId: {
        type: Schema.Types.ObjectId,   
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },    
    date: {
        type: Date,
        required: true
    },
    text: {
        type: String,
        default: ""
    }
})

module.exports = model('Comments', commentSchema)