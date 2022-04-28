const mongoose = require('mongoose');
const validator = require('validator');

const authorSchema = new mongoose.Schema({
    firstName:
    {
        type: String,
        required: true,
        trim:true
    },
    lastName:
    {
        type: String,
        required: true,
        trim:true
    },
    title:
    {
        type: String,
        trim:true,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
        required: true,
        trim:true,
        unique: true,
        validate: {
            validator: validator.isEmail, message: "{VALUE} is not a valid email", isAsync: false
        }
    },
    password:
    {
        type: String,
        required: true,
        trim:true
    }

}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema)
