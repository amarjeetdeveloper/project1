const mongoose = require('mongoose');
//const validator = require('validator');

const authorSchema = new mongoose.Schema({

    fname: { 
        type: String, 
        required:'firstName is Required',
        trim:true
    },

    lname: {
         type: String,
         required: 'lastName is Required',
         trim:true
        },

    title: { 
        type: String, 
        required:'Title is Required', 
        enum: ["Mr", "Mrs", "Miss"] },

    email: {
        type: String, 
        required: 'EmailId is FRequired', 
        lowercase:true,
        trim:true,
        unique: true, 
      /* validate: {
             validator:function(check){return /^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(check);},
            validator: validator.isEmail, message: "{VALUE} is not a valid email", isAsync: false
        } */
    },

    password: {
         type: String, 
         trim:true,
         required: 'Password is Required' }

}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema)
