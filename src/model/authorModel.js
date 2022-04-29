const mongoose = require('mongoose');
//const validator = require('validator');

const authorSchema = new mongoose.Schema({
    firstName: { type: String, required:true },
    lastName: { type: String, required: true },
    title: { type: String, required: true, enum: ["Mr", "Mrs", "Miss"] },
    email: {
        type: String, required: true, unique: true, 
        validate: {
             validator:function(check){return /^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(check);},
        //     validator: validator.isEmail, message: "{VALUE} is not a valid email", isAsync: false
        }
    },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema)
