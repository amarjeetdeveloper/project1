const authorModel = require("../model/authorModel")
const jwt = require('jsonwebtoken')


  
//===========================================1-Create Author Api====================================================//

const createAuthor = async function (req, res) {

   try {

        let data = req.body

        if (!Object.keys(data).length) return res.status(400).send({ status: false, msg: "Please Provides the Details" })

        //-------------------------------------------check data validity-----------------------------------------------------//
        
        if (!data.fname) return res.status(400).send({ status: false, msg: "firstName is Required" })

        if (!data.lname) return res.status(400).send({ status: false, msg: "lastName is Required" })

        if (!data.fname.match(/^[a-zA-Z]+$/)) return res.status(400).send({ status: false, msg: "invalid  firstName" })

        if (!data.lname.match(/^[a-zA-Z]+$/)) return res.status(400).send({ status: false, msg: "invalid lastName" })

        if (!data.title) return res.status(400).send({ status: false, msg: "title is Required" })

        if (["Mr", "Mrs", "Miss"].indexOf(data.title) == -1) return res.status(400).send({status: false,data: "Enter a valid title Mr or Mrs or Miss ",});

        if (!data.email) return res.status(400).send({ status: false, msg: "emailId is Required" }) 

        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/).test(data.email)) return res.status(400).send({ status: false, msg: "email Id is invalid" })

        if (!data.password) return res.status(400).send({ status: false, msg: "password is Required" })

        //-------------------------------/check email duplicacy/------------------------------------------------------//

        let emailCheck = await authorModel.findOne({ email: data.email })

        if (emailCheck) return res.status(409).send({ status: false, msg: "emailId already Registerd" })

        //--------------------------------------------create author-----------------------------------------------------//
        
        let saveData = await authorModel.create(data)

        res.status(201).send({ status: true, msg:"Author Created Sucessfully",data:saveData })

    }
    catch (err) {

        res.status(500).send({ error: err.message })

    }

}

//============================================2-Login and Token Generation Api=====================================//

const login = async function (req, res) {

    try{

    let data = req.body

    if (!Object.keys(data).length) return res.status(404).send({ status: false, msg: "Please Provide the Correct Login Details" })

    if (!data.email) return res.status(401).send({ status: false, msg: "emailId is required" })

    if (!data.password) return res.status(401).send({ status: false, msg: "password is required" })

    if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/).test(data.email)) return res.status(400).send({ status: false, msg: "email Id is invalid" })

    //-------------------------------------check the email and password--------------------------------------------//

    let user = await authorModel.findOne({ email: data.email, password: data.password })

    if (!user) return res.status(401).send({ status: false, msg: "emailId or password incorrect" })

    //-------------------------------------------Token Generation------------------------------------------------//

    let token = await jwt.sign({ 
                          userId: user._id.toString(),
                        iat:Math.floor(Date.now()/100),
                        exp:Math.floor(Date.now()/100)
                    },"IUBGIU22NKJWWEW89NO2ODWOIDH2")

    res.setHeader("x-api-key", token)

    res.status(201).send({ status: true, msg: "Author login successful!!", token })
}

catch (err) {

    res.status(500).send({ status: false, msg: err.message });
}
}


module.exports ={createAuthor,login}

