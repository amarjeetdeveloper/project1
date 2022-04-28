const mongoose = require('mongoose');
const validator = require('validator');

const authorSchema = new mongoose.Schema( {
firstName: {type:String, require:true}, 
lastName: {type:String, require:true},
title: {type:String, requires:true, enum:["Mr", "Mrs", "Miss"]}, 
email: {type:String, requires:true, unique:true, validate:{
          validator: validator.isEmail, message: "{VALUE} is not a valid email",isAsync: false}}, 
password: {type:String, require:true}
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema)
