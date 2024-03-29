const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
    ,
    note: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note'
    }],
})

module.exports = mongoose.model('User', userSchema, 'users');