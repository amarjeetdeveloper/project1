const jwt = require("jsonwebtoken")
const blogModel = require('../model/blogModel')
const authorModel=require("../model/authorModel")


//authentication
const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token)return res.status(400).send({ status: false, msg: "token not found" })
         //verify token
        let decodedToken = jwt.verify(token, "IUBGIU22NKJWWEW89NO2ODWOIDH2")
        if (!decodedToken) return res.status(400).send({ status: false, msg: "invalid token" })
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

//authorization

const authorization = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        if (!token)return res.status(400).send({ status: false, msg: "token not found" })
         //verify token
        let decodedToken = jwt.verify(token, "IUBGIU22NKJWWEW89NO2ODWOIDH2")
        if (!decodedToken) return res.status(400).send({ status: false, msg: "invalid token" })

        let blog_Id = req.params.blogId
        //if(!blog_Id.length===null) return res.status(404).send({ status: false, msg: "blogId not found" })
        let userId = decodedToken.userId
        let authorData=await blogModel.find({_id:blog_Id,authorId:userId})
       if (authorData.length==0)return res.send({ status: false, msg:"you are not authorized" })
        next()
  }
    catch (error) {
        res.status(403).send(error.message)
    }
}



module.exports.authentication = authentication
module.exports.authorization = authorization