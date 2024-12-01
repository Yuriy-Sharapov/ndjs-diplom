const {Schema, model} = require('mongoose')

const advertSchema = new Schema({
    shortText: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    images: {
        type: [String],
        required: false
    },
    userId:	{
        type: ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    updatedAt: {
        type: Date,
    },
    tags: {
        type: [String],
        required: false
    },
    isDeleted: {
        types: boolean,
    }
})

module.exports = model('adverts', advertSchema)


