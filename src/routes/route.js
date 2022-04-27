const express=require('express')
const router = express.Router()
const authorController=require('../controller/authorController')
const blogController=require('../controller/blogController')



router.post('/createAuthor',authorController.createAuthor);
router.post('/createBlog',blogController.createBlog);
router.get('/getSpecificAllBlogs',blogController.getSpecificAllBlogs);





module.exports=router