const mongoose=require("mongoose")
const ObjectId=mongoose.schema.Types.ObjectId
const blogSchema=new mongoose.Schema({
 title: {
    type:String,
    required:true,
 }, 
body: {
    type:String,
    required:true,
},
   
authorId: {
    type:ObjectId,
    required:true,
    ref:'Author'
},
 tags:[String],
 
 category: {
     type:[String],
     required:true
 },  
 subcategory: {
   type:[String]
 },

 
    type:Boolean, 
    default: false 
 }, 
publishedAt:Date,
    
    isPublished: {
       type:Boolean,
       default : false
    }

}, { timestamps: true });

module.exports=mongoose.model('blogModel',blogSchema)
