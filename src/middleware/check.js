const jwt = require("jsonwebtoken")
const blogModel = require('../model/blogModel')
const mongoose=require('mongoose')



//=================================================authentication==================================================//

const authentication = function (req, res, next) {

    try {

        let token = req.headers["x-api-key"]

        if (!token)return res.status(400).send({ status: false, msg: "token not found" })

        let decodedToken = jwt.verify(token, "IUBGIU22NKJWWEW89NO2ODWOIDH2")//verify token
        
        if (!decodedToken) return res.status(401).send({ status: false, msg: "invalid token" })
        
        next()
    }

    catch (err) {
    
        res.status(500).send({ status: false, msg: err.message });
    }
}

//========================================================authorization===============================================//

const authorization = async function (req, res, next) {
   
    try {
      
        let token = req.headers["x-api-key"]
      
        if (!token)return res.status(400).send({ status: false, msg: "token not found" })
      
        let decodedToken = jwt.verify(token, "IUBGIU22NKJWWEW89NO2ODWOIDH2")
      
        if (!decodedToken) return res.status(401).send({ status: false, msg: "invalid token" })

        let blog_Id = req.params.blogId

        if (!mongoose.isValidObjectId(blog_Id)) return res.status(400).send({ status: false, msg: "Enter a Valid BlogId"})

        let userId = decodedToken.userId
        
        let authorData=await blogModel.find({_id:blog_Id,authorId:userId})
       
        if (!authorData.length)return res.send({ status: false, msg:"you are not authorized" })
       
        next()
  }

    catch (error) {
  
        res.status(403).send(error.message)
  
    }
}

//==================================================authorization 2===========================================//

const authorization2 = async function (req, res, next) {

    try {

        let token = req.headers["x-api-key"]

        if (!token)return res.status(400).send({ status: false, msg: "token not found" })
         
        let decodedToken = jwt.verify(token, "IUBGIU22NKJWWEW89NO2ODWOIDH2")

        if (!decodedToken) return res.status(400).send({ status: false, msg: "invalid token" })

        let data = req.query;

        if (!Object.keys(data).length) return res.status(404).send({ status: false, msg: "Query data empty" })

        let userId = decodedToken.userId

        let Auth_Id = data.authorId

        let cat=data.category

        let subcat=data.subcategory

        let tag=data.tags

        let publish=data.isPublished

        if(Auth_Id){
            if(Auth_Id!=userId)return res.send({ status: false, msg:"you are not authorized" })
            next()
        }

        if(cat){
            let authorData=await blogModel.find({category:cat,authorId:userId})
            if (!authorData.length)return res.send({ status: false, msg:"you are not authorized" })
            next()
        }

        if(subcat){
            let authorData=await blogModel.find({subcategory:subcat,authorId:userId})
            if (!authorData.length)return res.send({ status: false, msg:"you are not authorized" })
            next()
        }

        if(tag){
            let authorData=await blogModel.find({tags:tag,authorId:userId})
            if (!authorData.length)return res.send({ status: false, msg:"you are not authorized" })
            next()
        }

        if(publish){
            let authorData=await blogModel.find({isPublished:publish,authorId:userId})
            if (!authorData.length)return res.send({ status: false, msg:"you are not authorized" })
            next()
        }
    
  }
    catch (error) {
        res.status(403).send(error.message)
    }
}



module.exports={authentication,authorization,authorization2}