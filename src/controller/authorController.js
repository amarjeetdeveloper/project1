const authorModel = require("../model/authorModel")

const createAuthor = async function (req, res) {
    try {
        let data = req.body
        if(Object.keys(data).length==0) return res.status(400).send("no data available")
        let{firstName,lastName,title,email,password}=data
        if(!firstName)return res.send("required firstName")
        if(!lastName)return res.send("required lastName")
        if(!title)return res.send("required title")
        if(!email)return res.send("required email")
        if(!password)return res.send("required passsword")
        let emailId=req.body.email
       let emailCheck=await authorModel.findOne({email:emailId})
       if(emailCheck) return res.status(404).send("emailId already exits")
        let saveData = await authorModel.create(data)
        res.status(201).send({ status: true, msg: saveData })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }

}

module.exports.createAuthor = createAuthor