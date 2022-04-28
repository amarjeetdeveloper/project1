const express=require('express')
const router = express.Router()
const authorController=require('../controller/authorController')
const blogController=require('../controller/blogController')



router.post('/createAuthor',authorController.createAuthor);
router.post('/createBlog',blogController.createBlog);
router.get('/getSpecificAllBlogs',blogController.getSpecificAllBlogs);
router.put('/updateBlog/:blogId',blogController.updateBlog)
router.delete('/deleteblogs/:blogId',blogController.deleteBlog)
router.delete('/deletequery',blogController.deleteParams)




module.exports=router