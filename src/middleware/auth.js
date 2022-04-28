

const authentication= function(req,res,next){
try{
    let token=req.headers["x-Auth-token"]
    if (!token) token= req.headers["x-auth-token"]
    if(!token)
    return res.status(400).send({status:false,msg:"token must be present"})
    let decodedToken=jwt.verify(tpken,"phase2")
    if (!decodedToken)
    return res.status(400).send({status:false, msg:"token is not valid"}) 
    




}