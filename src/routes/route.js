const express=require('express')
const router = express.Router()
const authorController=require('../controller/authorController')
const blogController=require('../controller/blogController')



router.get('/test',function(req,res){
    console.log("working")
    res.send("working")
})
router.post('/createAuthor',authorController.createAuthor);
router.post('/createBlog',blogController.createBlog);
router.get('/getSpecificAllBlogs',blogController.getSpecificAllBlogs);





module.exports=router