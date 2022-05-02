const authorModel = require("../model/authorModel")
const jwt = require('jsonwebtoken')



//1-Create Author Api
const createAuthor = async function (req, res) {

    try {

        let data = req.body
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Input Can't be Empty" })

        //-------------------------------------------check data validity-----------------------------------------------------//
        let { firstName, lastName, title, email, password } = data
        if (!firstName) return res.status(400).send({ status: false, msg: "fistName Required" })
        if (!lastName) return res.status(400).send({ status: false, msg: "lastName Required" })
        if (!firstName.match(/^[a-zA-Z]+$/)) return res.status(400).send({ status: false, msg: "invalid  fistName" })
        if (!lastName.match(/^[a-zA-Z]+$/)) return res.status(400).send({ status: false, msg: "invalid lastName" })
        if (!title) return res.status(400).send({ status: false, msg: "title Required" })
        if (!email) return res.status(400).send({ status: false, msg: "emailId Required" }) 
        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/).test(email)) return res.status(400).send({ status: false, msg: "email Id is invalid" })
        if (!password) return res.status(400).send({ status: false, msg: "password Required" })


        //-------------------------------/check email duplicacy/------------------------------------------------------//

        let emailCheck = await authorModel.findOne({ email: email })
        if (emailCheck) return res.status(409).send({ status: false, msg: "emailId already exits" })

        //--------------------------------------------create author-----------------------------------------------------//
        let saveData = await authorModel.create(data)
        res.status(201).send({ status: true, msg: saveData })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }

}

//2-Login and Token Generation Api

const login = async function (req, res) {
    try{
    let data = req.body
    let { email, password } = data
    if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "input cant be empty" })

    if (!email) return res.status(401).send({ status: false, msg: "emailId required" })
    if (!password) return res.status(401).send({ status: false, msg: "password required" })
    //---------------------------check the email and password-----------------------------------------------------//
    let user = await authorModel.findOne({ email: email, password: password })
    if (!user) return res.status(401).send({ status: false, msg: "emailId or password incorrect" })

    //-------------------------------------------Token Generation------------------------------------------------//

    let token = await jwt.sign({ userId: user._id.toString() }, "IUBGIU22NKJWWEW89NO2ODWOIDH2")
    res.setHeader("x-api-key", "token")
    res.status(201).send({ status: true, msg: "successful login", token })
}
catch (err) {
    res.status(500).send({ status: false, msg: err.message });
}
}


module.exports.createAuthor = createAuthor
module.exports.login = login
