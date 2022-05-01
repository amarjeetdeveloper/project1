const express=require('express')
const router = express.Router()
const authorController=require('../controller/authorController')
const blogController=require('../controller/blogController')
const middleWare=require('../middleware/auth')


//-------------------------unprotected apis----------------------//

router.post('/createAuthor',authorController.createAuthor);
router.post('/login',authorController.login);

//--------------------------protected apis----------------------------------------//

router.post('/createBlog',middleWare.authentication,blogController.createBlog);
router.get('/getSpecificAllBlogs',middleWare.authentication,blogController.getSpecificAllBlogs);
router.put('/updateBlog/:blogId',middleWare.authorization,blogController.updateBlog)
router.delete('/deleteblogs/:blogId',middleWare.authorization,blogController.deleteBlog)
router.delete('/deletequery',middleWare.authorization2,blogController.deleteparams)




module.exports=router