const {Schema, model, ObjectId} = require('mongoose')

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
        required: false
    },
    tags: {
        type: [String],
        required: false
    },
    isDeleted: {
        type: Boolean,
        required: false
    }
})

module.exports = model('adverts', advertSchema)


