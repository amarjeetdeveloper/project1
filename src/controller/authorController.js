const authorModel = require("../model/authorModel")

const createAuthor = async function (req, res) {
    try {
        let data = req.body //data comes from body
        if(Object.keys(data).length==0) return res.status(404).send({status:false,msg:"No data found"})

        let{firstName,lastName,title,email,password}=data //check data that available or not
        if(!firstName)return res.status(404).send({status:false,msg:"fistName not found"})
        if(!lastName)return res.status(404).send({status:false,msg:"lastName not found"})
        if(!title)return res.status(404).send({status:false,msg:"title not found"})
        if(!email)return res.status(404).send({status:false,msg:"email not found"})
        if(!password)return res.status(404).send({status:false,msg:"password not found"})

       let emailCheck=await authorModel.findOne({email:email})//check email duplicacy
       if(emailCheck) return res.status(409).send({status:false,msg:"emailId already exits"})

        let saveData = await authorModel.create(data) //create author
        res.status(201).send({ status: true, msg: saveData })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }

}

module.exports.createAuthor = createAuthor