const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const noteSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    description:{
        type:String,
        required:true
    },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
})

module.exports = mongoose.model('Note', noteSchema, 'notes');