const jwt=require("jsonwebtoken")

const authentication= function(req,res,next){
    try{
        let token=req.headers["x-Api-key"]
        if (!token) token= req.headers["x-api-key"]
        if(!token)
        return res.status(400).send({status:false,msg:"token must be present"})
        let decodedToken=jwt.verify(token,"IUBGIU22NKJWWEW89NO2ODWOIDH2")
        if (!decodedToken)
        return res.status(400).send({status:false, msg:"token is not valid"})
  next()  }
        catch (err) {
            res.status(500).send({ status: false, msg: err.message });
          }
      

        const authorization= async function(req,res,next){
            try{
            let token=req.headers["x-Api-key"]
            if (!token) token= req.headers["x-api-key"]
            if(!token)
            return res.status(400).send({status:false,msg:"token must be present"})
            let decodedToken=jwt.verify(token,"IUBGIU22NKJWWEW89NO2ODWOIDH2")
            console.log(decodedToken)
            if (!decodedToken)
            return res.status(400).send({status:false, msg:"token is not valid"})

            let userToBeModified = req.params.blogid
        let userLoggedIn = decodedToken.blogId
        if(userToBeModified != userLoggedIn) return res.send({status: false, msg: 'User logged is not allowed to modify the requested blog data'})
 next()
    }
    catch (error){
        res.status(403).send(error.message)                
     }}

         

        }

        