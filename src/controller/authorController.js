const authorModel = require("../model/authorModel")
const jwt = require('jsonwebtoken')

const createAuthor = async function (req, res) {
    try {
        let data = req.body //data comes from body
        if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "No data found" })

        let { firstName, lastName, title, email, password } = data //check data that available or not
        if (!firstName) return res.status(404).send({ status: false, msg: "fistName not found" })
        if (!lastName) return res.status(404).send({ status: false, msg: "lastName not found" })
        if (!title) return res.status(404).send({ status: false, msg: "title not found" })
        if (!email) return res.status(404).send({ status: false, msg: "email not found" })
        if (!password) return res.status(404).send({ status: false, msg: "password not found" })

        let emailCheck = await authorModel.findOne({ email: email })//check email duplicacy
        if (emailCheck) return res.status(409).send({ status: false, msg: "emailId already exits" })

        let saveData = await authorModel.create(data) //create author
        res.status(201).send({ status: true, msg: saveData })
    }
    catch (err) {
        res.status(500).send({ error: err.message })
    }

}

const login = async function (req, res) {
    let data = req.body
    let { email, password } = data
    if (Object.keys(data).length == 0) return res.status(404).send({ status: false, msg: "no data found" })
    if (!email) return res.status(401).send({ status: false, msg: "emailId required" })
    if (!password) return res.status(401).send({ status: false, msg: "password required" })
    let user = await authorModel.findOne({ email: email, password: password })
    if (!user) return res.status(401).send({ status: false, msg: "emailId or password incorrect" })
    let token = await jwt.sign({ userId: user._id.toString() }, "IUBGIU22NKJWWEW89NO2ODWOIDH2")
    res.setHeader("x-api-key", "token")
    res.status(201).send({ status: true, msg: "successful login", token })
}

module.exports.createAuthor = createAuthor
module.exports.login = login
