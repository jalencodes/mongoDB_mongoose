import mongoose from 'mongoose'

const gradesSchema = new mongoose.Schema({
    class_id: {
        type: Number,
        required: true
    },
    scores: {
        type: Array,
        required: true
    },
    learner_id: {
        type: Number,
        required: true,
    }
})


export default new mongoose.model('Grades', gradesSchema)