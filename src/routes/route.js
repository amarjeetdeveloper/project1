const express=require('express')
const router = express.Router()
const authorController=require('../controller/authorController')



router.get('/test',function(req,res){
    console.log("working")
    res.send("working")
})
router.post('/createAuthor',authorController.createAuthor);




module.exports=router